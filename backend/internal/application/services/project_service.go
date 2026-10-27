// Package services implements the application use cases.
package services

import (
	"context"

	"github.com/maurobanegas43/proyecto_final/backend/internal/application/ports"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
)

// CreateProjectCommand is the input for the CreateProject use case.
type CreateProjectCommand struct {
	DeveloperID string
	Name        string
	Location    string
	Description string
	FundingGoal int64
}

// ProjectService coordinates project use cases through ports only.
type ProjectService struct {
	repo  ports.ProjectRepository
	ids   ports.IDGenerator
	clock ports.Clock
}

func NewProjectService(repo ports.ProjectRepository, ids ports.IDGenerator, clock ports.Clock) *ProjectService {
	return &ProjectService{repo: repo, ids: ids, clock: clock}
}

func (s *ProjectService) CreateProject(ctx context.Context, cmd CreateProjectCommand) (*project.Project, error) {
	p, err := project.New(s.ids.NewID(), cmd.DeveloperID, cmd.Name, cmd.Location, cmd.Description,
		project.Money(cmd.FundingGoal), s.clock.Now())
	if err != nil {
		return nil, err
	}
	if err := s.repo.Save(ctx, p); err != nil {
		return nil, err
	}
	return p, nil
}

func (s *ProjectService) SubmitForReview(ctx context.Context, id string) (*project.Project, error) {
	return s.transition(ctx, id, project.StatusUnderReview)
}

func (s *ProjectService) ApproveProject(ctx context.Context, id string) (*project.Project, error) {
	return s.transition(ctx, id, project.StatusApproved)
}

func (s *ProjectService) GetProject(ctx context.Context, id string) (*project.Project, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *ProjectService) ListProjects(ctx context.Context, status *project.Status) ([]*project.Project, error) {
	return s.repo.List(ctx, status)
}

func (s *ProjectService) transition(ctx context.Context, id string, next project.Status) (*project.Project, error) {
	p, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := p.TransitionTo(next, s.clock.Now()); err != nil {
		return nil, err
	}
	if err := s.repo.Save(ctx, p); err != nil {
		return nil, err
	}
	return p, nil
}
