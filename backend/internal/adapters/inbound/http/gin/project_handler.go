// Package gin is the inbound HTTP adapter. It translates HTTP into
// application commands and never contains core business rules.
package gin

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
)

// projectDTO is the HTTP representation, decoupled from the domain entity.
type projectDTO struct {
	ID            string    `json:"id"`
	DeveloperID   string    `json:"developerId"`
	Name          string    `json:"name"`
	Location      string    `json:"location"`
	Description   string    `json:"description"`
	FundingGoal   int64     `json:"fundingGoal"`
	FundsRaised   int64     `json:"fundsRaised"`
	FundedPercent int       `json:"fundedPercent"`
	Progress      int       `json:"progress"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"createdAt"`
}

type createProjectRequest struct {
	DeveloperID string `json:"developerId" binding:"required"`
	Name        string `json:"name" binding:"required,max=120"`
	Location    string `json:"location" binding:"max=120"`
	Description string `json:"description" binding:"max=2000"`
	FundingGoal int64  `json:"fundingGoal" binding:"required,gt=0"`
}

type errorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ProjectHandler struct {
	svc *services.ProjectService
}

func NewProjectHandler(svc *services.ProjectService) *ProjectHandler {
	return &ProjectHandler{svc: svc}
}

func (h *ProjectHandler) Register(rg *gin.RouterGroup) {
	g := rg.Group("/projects")
	g.GET("", h.list)
	g.POST("", h.create)
	g.GET("/:id", h.get)
	g.POST("/:id/submit", h.submit)
	g.POST("/:id/approve", h.approve)
}

func (h *ProjectHandler) list(c *gin.Context) {
	var status *project.Status
	if s := c.Query("status"); s != "" {
		st := project.Status(s)
		status = &st
	}
	items, err := h.svc.ListProjects(c.Request.Context(), status)
	if err != nil {
		writeError(c, err)
		return
	}
	out := make([]projectDTO, 0, len(items))
	for _, p := range items {
		out = append(out, toDTO(p))
	}
	c.JSON(http.StatusOK, gin.H{"data": out})
}

func (h *ProjectHandler) create(c *gin.Context) {
	var req createProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Code: "invalid_request", Message: "invalid request body"})
		return
	}
	p, err := h.svc.CreateProject(c.Request.Context(), services.CreateProjectCommand{
		DeveloperID: req.DeveloperID,
		Name:        req.Name,
		Location:    req.Location,
		Description: req.Description,
		FundingGoal: req.FundingGoal,
	})
	if err != nil {
		writeError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": toDTO(p)})
}

func (h *ProjectHandler) get(c *gin.Context) {
	p, err := h.svc.GetProject(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toDTO(p)})
}

func (h *ProjectHandler) submit(c *gin.Context) {
	p, err := h.svc.SubmitForReview(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toDTO(p)})
}

func (h *ProjectHandler) approve(c *gin.Context) {
	p, err := h.svc.ApproveProject(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toDTO(p)})
}

func toDTO(p *project.Project) projectDTO {
	return projectDTO{
		ID:            p.ID,
		DeveloperID:   p.DeveloperID,
		Name:          p.Name,
		Location:      p.Location,
		Description:   p.Description,
		FundingGoal:   int64(p.FundingGoal),
		FundsRaised:   int64(p.FundsRaised),
		FundedPercent: p.FundedPercent(),
		Progress:      p.Progress,
		Status:        string(p.Status),
		CreatedAt:     p.CreatedAt,
	}
}

// writeError maps domain errors to HTTP codes without leaking internals.
func writeError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, project.ErrNotFound):
		c.JSON(http.StatusNotFound, errorResponse{Code: "not_found", Message: err.Error()})
	case errors.Is(err, project.ErrInvalidName), errors.Is(err, project.ErrInvalidGoal):
		c.JSON(http.StatusUnprocessableEntity, errorResponse{Code: "validation_error", Message: err.Error()})
	case errors.Is(err, project.ErrInvalidTransition):
		c.JSON(http.StatusConflict, errorResponse{Code: "invalid_transition", Message: err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, errorResponse{Code: "internal_error", Message: "unexpected error"})
	}
}
