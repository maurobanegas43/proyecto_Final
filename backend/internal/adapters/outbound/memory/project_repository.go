// Package memory provides in-memory adapters for development and tests.
// It will be replaced by the PostgreSQL adapter without touching the domain.
package memory

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"sort"
	"sync"
	"time"

	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
)

type ProjectRepository struct {
	mu   sync.RWMutex
	data map[string]project.Project
}

func NewProjectRepository() *ProjectRepository {
	return &ProjectRepository{data: make(map[string]project.Project)}
}

func (r *ProjectRepository) Save(_ context.Context, p *project.Project) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.data[p.ID] = *p
	return nil
}

func (r *ProjectRepository) FindByID(_ context.Context, id string) (*project.Project, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	p, ok := r.data[id]
	if !ok {
		return nil, project.ErrNotFound
	}
	return &p, nil
}

func (r *ProjectRepository) List(_ context.Context, status *project.Status) ([]*project.Project, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]*project.Project, 0, len(r.data))
	for _, p := range r.data {
		if status != nil && p.Status != *status {
			continue
		}
		cp := p
		out = append(out, &cp)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].CreatedAt.Before(out[j].CreatedAt) })
	return out, nil
}

// RandomID generates opaque hex identifiers.
type RandomID struct{}

func (RandomID) NewID() string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// SystemClock returns the current UTC time.
type SystemClock struct{}

func (SystemClock) Now() time.Time { return time.Now().UTC() }
