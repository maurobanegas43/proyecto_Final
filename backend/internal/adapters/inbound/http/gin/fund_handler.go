package gin

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/fund"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
)

type createInvestmentRequest struct {
	ProjectID   string `json:"projectId" binding:"required"`
	InvestorID  string `json:"investorId" binding:"required"`
	AmountCents int64  `json:"amountCents" binding:"required,gt=0"`
}

type FundHandler struct {
	svc *services.FundService
}

func NewFundHandler(svc *services.FundService) *FundHandler {
	return &FundHandler{svc: svc}
}

func (h *FundHandler) Register(rg *gin.RouterGroup) {
	g := rg.Group("/funds")
	g.POST("/investments", h.createInvestment)
	g.GET("/investments/:id", h.getInvestment)
	g.GET("/investors/:id/investments", h.listInvestorInvestments)
	g.GET("/accounts/:id/balance", h.getBalance)
}

func (h *FundHandler) createInvestment(c *gin.Context) {
	var req createInvestmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "INVALID_REQUEST", Message: err.Error()})
		return
	}

	inv, err := h.svc.InvestInProject(c.Request.Context(), services.CreateInvestmentCommand{
		ProjectID:   req.ProjectID,
		InvestorID:  req.InvestorID,
		AmountCents: req.AmountCents,
	})
	if err != nil {
		if errors.Is(err, user.ErrKYCNotVerified) {
			c.JSON(http.StatusForbidden, errorResponse{
				Code:    "KYC_REQUIRED",
				Message: "Investor must complete KYC verification before investing funds.",
			})
			return
		}
		if errors.Is(err, project.ErrNotFound) {
			c.JSON(http.StatusNotFound, errorResponse{Code: "PROJECT_NOT_FOUND", Message: err.Error()})
			return
		}
		if errors.Is(err, services.ErrProjectNotInvestable) {
			c.JSON(http.StatusConflict, errorResponse{Code: "PROJECT_NOT_INVESTABLE", Message: err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, errorResponse{Code: "INVESTMENT_FAILED", Message: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":          inv.ID,
		"projectId":   inv.ProjectID,
		"investorId":  inv.InvestorID,
		"amountCents": inv.AmountCents,
		"status":      inv.Status,
		"createdAt":   inv.CreatedAt,
	})
}

func (h *FundHandler) getInvestment(c *gin.Context) {
	id := c.Param("id")
	inv, err := h.svc.GetInvestment(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse{Code: "INTERNAL_ERROR", Message: err.Error()})
		return
	}
	if inv == nil {
		c.JSON(http.StatusNotFound, errorResponse{Code: "NOT_FOUND", Message: "Investment not found"})
		return
	}

	c.JSON(http.StatusOK, inv)
}

func (h *FundHandler) listInvestorInvestments(c *gin.Context) {
	investorID := c.Param("id")
	list, err := h.svc.ListInvestmentsByInvestor(c.Request.Context(), investorID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse{Code: "INTERNAL_ERROR", Message: err.Error()})
		return
	}
	if list == nil {
		list = []*fund.Investment{}
	}
	c.JSON(http.StatusOK, list)
}

func (h *FundHandler) getBalance(c *gin.Context) {
	accountID := c.Param("id")
	balance, err := h.svc.GetAccountBalance(c.Request.Context(), accountID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse{Code: "INTERNAL_ERROR", Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accountId":    accountID,
		"balanceCents": balance,
	})
}
