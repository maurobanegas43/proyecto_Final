// Package ports declares the contracts the application layer needs.
// Adapters implement these interfaces; the application never knows which one.
package ports

import (
	"context"
	"time"

	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
)

// ProjectRepository persists and retrieves project aggregates.
type ProjectRepository interface {
	Save(ctx context.Context, p *project.Project) error
	FindByID(ctx context.Context, id string) (*project.Project, error)
	List(ctx context.Context, status *project.Status) ([]*project.Project, error)
}

// IDGenerator decouples identity generation from the domain.
type IDGenerator interface {
	NewID() string
}

// Clock decouples time from the domain to keep use cases testable.
type Clock interface {
	Now() time.Time
}
