package memory

import (
	"context"
	"sync"
	"time"

	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
)

type UserRepository struct {
	mu       sync.RWMutex
	users    map[string]*user.User
	byEmail  map[string]string // email -> user_id
	profiles map[string]*user.InvestorProfile
	consents []*user.LegalConsent
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		users:    make(map[string]*user.User),
		byEmail:  make(map[string]string),
		profiles: make(map[string]*user.InvestorProfile),
		consents: make([]*user.LegalConsent, 0),
	}
}

func (r *UserRepository) SaveUser(_ context.Context, u *user.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	cp := *u
	r.users[u.ID] = &cp
	r.byEmail[u.Email] = u.ID
	return nil
}

func (r *UserRepository) FindUserByID(_ context.Context, id string) (*user.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	u, ok := r.users[id]
	if !ok {
		return nil, nil
	}
	cp := *u
	return &cp, nil
}

func (r *UserRepository) FindUserByEmail(_ context.Context, email string) (*user.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	id, ok := r.byEmail[email]
	if !ok {
		return nil, nil
	}
	return r.FindUserByID(context.Background(), id)
}

func (r *UserRepository) SaveInvestorProfile(_ context.Context, p *user.InvestorProfile) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	cp := *p
	r.profiles[p.UserID] = &cp
	return nil
}

func (r *UserRepository) FindInvestorProfileByUserID(_ context.Context, userID string) (*user.InvestorProfile, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	p, ok := r.profiles[userID]
	if !ok {
		return nil, nil
	}
	cp := *p
	return &cp, nil
}

func (r *UserRepository) UpdateKYCStatus(_ context.Context, userID string, status user.KYCStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	p, ok := r.profiles[userID]
	if !ok {
		return nil
	}
	p.KYCStatus = status
	if status == user.KYCVerified {
		now := time.Now()
		p.VerifiedAt = &now
	}
	return nil
}

func (r *UserRepository) SaveLegalConsent(_ context.Context, consent *user.LegalConsent) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	cp := *consent
	r.consents = append(r.consents, &cp)
	return nil
}
