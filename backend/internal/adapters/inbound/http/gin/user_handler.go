package gin

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
)

type registerRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required,min=8,max=72"`
	Role     string `json:"role" binding:"required,oneof=investor developer admin"`
	UserType string `json:"userType" binding:"required,oneof=individual corporate"`
}

type investorProfileRequest struct {
	FullName           string `json:"fullName" binding:"required"`
	DNI                string `json:"dni" binding:"required"`         // Sensitive PII
	CUIL               string `json:"cuil" binding:"required"`        // Sensitive PII
	BirthDate          string `json:"birthDate" binding:"required"`
	Address            string `json:"address" binding:"required"`     // Sensitive PII
	City               string `json:"city" binding:"required"`
	Province           string `json:"province" binding:"required"`
	FundsOrigin        string `json:"fundsOrigin" binding:"required"`
	IsPEP              bool   `json:"isPep"`
	IsObligatedSubject bool   `json:"isObligatedSubject"`
}

type updateKYCRequest struct {
	Status string `json:"status" binding:"required"`
}

type consentRequest struct {
	ConsentType     string `json:"consentType" binding:"required"`
	DocumentVersion string `json:"documentVersion" binding:"required"`
	DocumentHash    string `json:"documentHash" binding:"required"`
}

type UserHandler struct {
	svc *services.UserService
}

func NewUserHandler(svc *services.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) Register(rg *gin.RouterGroup) {
	g := rg.Group("/users")
	g.POST("/register", h.register)
	g.POST("/:id/investor-profile", h.saveInvestorProfile)
	g.GET("/:id/investor-profile", h.getInvestorProfile)
	g.POST("/:id/kyc", h.updateKYC)
	g.POST("/:id/consents", h.recordConsent)
}

func (h *UserHandler) register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "INVALID_REQUEST", Message: err.Error()})
		return
	}

	u, err := h.svc.RegisterUser(c.Request.Context(), services.RegisterUserCommand{
		Email:    req.Email,
		Phone:    req.Phone,
		Password: req.Password,
		Role:     user.Role(req.Role),
		UserType: user.UserType(req.UserType),
	})
	if err != nil {
		if errors.Is(err, services.ErrUserAlreadyExists) {
			c.JSON(http.StatusConflict, errorResponse{Code: "USER_ALREADY_EXISTS", Message: err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, errorResponse{Code: "REGISTRATION_FAILED", Message: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":        u.ID,
		"email":     u.Email,
		"phone":     u.Phone,
		"role":      u.Role,
		"userType":  u.UserType,
		"isActive":  u.IsActive,
		"createdAt": u.CreatedAt,
	})
}

func (h *UserHandler) saveInvestorProfile(c *gin.Context) {
	userID := c.Param("id")
	var req investorProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "INVALID_REQUEST", Message: err.Error()})
		return
	}

	profile, err := h.svc.SaveInvestorProfile(c.Request.Context(), services.SaveInvestorProfileCommand{
		UserID:             userID,
		FullName:           req.FullName,
		DNI:                req.DNI,
		CUIL:               req.CUIL,
		BirthDate:          req.BirthDate,
		Address:            req.Address,
		City:               req.City,
		Province:           req.Province,
		FundsOrigin:        req.FundsOrigin,
		IsPEP:              req.IsPEP,
		IsObligatedSubject: req.IsObligatedSubject,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "PROFILE_SAVE_FAILED", Message: err.Error()})
		return
	}

	// Respond with acknowledgement without echoing plaintext PII back
	c.JSON(http.StatusOK, gin.H{
		"id":        profile.ID,
		"userId":    profile.UserID,
		"fullName":  profile.FullName,
		"kycStatus": profile.KYCStatus,
		"status":    "stored_encrypted",
	})
}

func (h *UserHandler) getInvestorProfile(c *gin.Context) {
	userID := c.Param("id")
	profile, err := h.svc.GetInvestorProfile(c.Request.Context(), userID)
	if err != nil {
		if errors.Is(err, services.ErrProfileNotFound) {
			c.JSON(http.StatusNotFound, errorResponse{Code: "PROFILE_NOT_FOUND", Message: err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, errorResponse{Code: "PROFILE_GET_FAILED", Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func (h *UserHandler) updateKYC(c *gin.Context) {
	userID := c.Param("id")
	var req updateKYCRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "INVALID_REQUEST", Message: err.Error()})
		return
	}

	if err := h.svc.UpdateKYCStatus(c.Request.Context(), userID, user.KYCStatus(req.Status)); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "KYC_UPDATE_FAILED", Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok", "kycStatus": req.Status})
}

func (h *UserHandler) recordConsent(c *gin.Context) {
	userID := c.Param("id")
	var req consentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "INVALID_REQUEST", Message: err.Error()})
		return
	}

	ip := c.ClientIP()
	if ip == "" {
		ip = "127.0.0.1"
	}

	err := h.svc.RecordConsent(c.Request.Context(), services.RecordConsentCommand{
		UserID:          userID,
		ConsentType:     user.ConsentType(req.ConsentType),
		DocumentVersion: req.DocumentVersion,
		DocumentHash:    req.DocumentHash,
		IPAddress:       ip,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "CONSENT_RECORD_FAILED", Message: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "recorded"})
}
