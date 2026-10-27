package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
)

type ProjectRepository struct {
	pool *pgxpool.Pool
}

func NewProjectRepository(pool *pgxpool.Pool) *ProjectRepository {
	return &ProjectRepository{pool: pool}
}

func (r *ProjectRepository) Save(ctx context.Context, p *project.Project) error {
	query := `
		INSERT INTO projects (id, developer_id, name, location, description, funding_goal, funds_raised, progress, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name,
			location = EXCLUDED.location,
			description = EXCLUDED.description,
			funding_goal = EXCLUDED.funding_goal,
			funds_raised = EXCLUDED.funds_raised,
			progress = EXCLUDED.progress,
			status = EXCLUDED.status,
			updated_at = EXCLUDED.updated_at
	`
	_, err := r.pool.Exec(ctx, query,
		p.ID, p.DeveloperID, p.Name, p.Location, p.Description,
		int64(p.FundingGoal), int64(p.FundsRaised), p.Progress, string(p.Status),
		p.CreatedAt, p.UpdatedAt,
	)
	return err
}

func (r *ProjectRepository) FindByID(ctx context.Context, id string) (*project.Project, error) {
	query := `SELECT id, developer_id, name, location, description, funding_goal, funds_raised, progress, status, created_at, updated_at FROM projects WHERE id = $1`
	row := r.pool.QueryRow(ctx, query, id)

	var p project.Project
	var goal, raised int64
	var status string
	err := row.Scan(&p.ID, &p.DeveloperID, &p.Name, &p.Location, &p.Description, &goal, &raised, &p.Progress, &status, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, project.ErrNotFound
		}
		return nil, err
	}
	p.FundingGoal = project.Money(goal)
	p.FundsRaised = project.Money(raised)
	p.Status = project.Status(status)
	return &p, nil
}

func (r *ProjectRepository) List(ctx context.Context, status *project.Status) ([]*project.Project, error) {
	var rows pgx.Rows
	var err error

	if status != nil {
		query := `SELECT id, developer_id, name, location, description, funding_goal, funds_raised, progress, status, created_at, updated_at FROM projects WHERE status = $1 ORDER BY created_at DESC`
		rows, err = r.pool.Query(ctx, query, string(*status))
	} else {
		query := `SELECT id, developer_id, name, location, description, funding_goal, funds_raised, progress, status, created_at, updated_at FROM projects ORDER BY created_at DESC`
		rows, err = r.pool.Query(ctx, query)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*project.Project
	for rows.Next() {
		var p project.Project
		var goal, raised int64
		var s string
		if err := rows.Scan(&p.ID, &p.DeveloperID, &p.Name, &p.Location, &p.Description, &goal, &raised, &p.Progress, &s, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		p.FundingGoal = project.Money(goal)
		p.FundsRaised = project.Money(raised)
		p.Status = project.Status(s)
		result = append(result, &p)
	}
	return result, rows.Err()
}
