package services

import (
	"context"
	"errors"
	"time"

	"github.com/maurobanegas43/proyecto_final/backend/internal/application/ports"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
	"github.com/maurobanegas43/proyecto_final/backend/internal/security/crypto"
	"github.com/maurobanegas43/proyecto_final/backend/internal/security/validation"
)

var (
	ErrUserAlreadyExists = errors.New("user: email already registered")
	ErrUserNotFound      = errors.New("user: not found")
	ErrProfileNotFound   = errors.New("user: investor profile not found")
)

type RegisterUserCommand struct {
	Email    string
	Phone    string
	Password string
	Role     user.Role
	UserType user.UserType
}

type SaveInvestorProfileCommand struct {
	UserID             string
	FullName           string
	DNI                string // Plaintext PII to be encrypted
	CUIL               string // Plaintext PII to be encrypted
	BirthDate          string
	Address            string // Plaintext PII to be encrypted
	City               string
	Province           string
	FundsOrigin        string
	IsPEP              bool
	IsObligatedSubject bool
}

type RecordConsentCommand struct {
	UserID          string
	ConsentType     user.ConsentType
	DocumentVersion string
	DocumentHash    string
	IPAddress       string
}

type DecryptedInvestorProfile struct {
	ID                 string
	UserID             string
	FullName           string
	DNI                string // Decrypted
	CUIL               string // Decrypted
	BirthDate          string
	Address            string // Decrypted
	City               string
	Province           string
	FundsOrigin        string
	IsPEP              bool
	IsObligatedSubject bool
	KYCStatus          user.KYCStatus
	VerifiedAt         *time.Time
}

type UserService struct {
	repo      ports.UserRepository
	encryptor crypto.Encryptor
	hasher    crypto.PasswordHasher
	ids       ports.IDGenerator
	clock     ports.Clock
}

func NewUserService(
	repo ports.UserRepository,
	encryptor crypto.Encryptor,
	hasher crypto.PasswordHasher,
	ids ports.IDGenerator,
	clock ports.Clock,
) *UserService {
	return &UserService{
		repo:      repo,
		encryptor: encryptor,
		hasher:    hasher,
		ids:       ids,
		clock:     clock,
	}
}

func (s *UserService) RegisterUser(ctx context.Context, cmd RegisterUserCommand) (*user.User, error) {
	// 1. Strict format & consistency validations
	cleanEmail, err := validation.ValidateGmail(cmd.Email)
	if err != nil {
		return nil, err
	}

	cleanPhone, err := validation.ValidateAndFormatPhone(cmd.Phone, "AR")
	if err != nil {
		return nil, err
	}

	if err := validation.ValidatePasswordStrength(cmd.Password); err != nil {
		return nil, err
	}

	// 2. Uniqueness check
	existing, _ := s.repo.FindUserByEmail(ctx, cleanEmail)
	if existing != nil {
		return nil, ErrUserAlreadyExists
	}

	// 3. Secure password hashing
	passHash, err := s.hasher.HashPassword(cmd.Password)
	if err != nil {
		return nil, err
	}

	// 4. Domain entity creation with validated invariants
	u, err := user.NewUser(s.ids.NewID(), cleanEmail, cleanPhone, passHash, cmd.Role, cmd.UserType, s.clock.Now())
	if err != nil {
		return nil, err
	}

	if err := s.repo.SaveUser(ctx, u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *UserService) SaveInvestorProfile(ctx context.Context, cmd SaveInvestorProfileCommand) (*user.InvestorProfile, error) {
	u, err := s.repo.FindUserByID(ctx, cmd.UserID)
	if err != nil || u == nil {
		return nil, ErrUserNotFound
	}

	// Encrypt sensitive PII with AES-256-GCM before database storage
	dniEnc, err := s.encryptor.Encrypt(cmd.DNI)
	if err != nil {
		return nil, err
	}
	cuilEnc, err := s.encryptor.Encrypt(cmd.CUIL)
	if err != nil {
		return nil, err
	}
	addrEnc, err := s.encryptor.Encrypt(cmd.Address)
	if err != nil {
		return nil, err
	}

	profile := &user.InvestorProfile{
		ID:                 s.ids.NewID(),
		UserID:             cmd.UserID,
		FullName:           cmd.FullName,
		DNIEncrypted:       dniEnc,
		CUILEncrypted:      cuilEnc,
		BirthDate:          cmd.BirthDate,
		AddressEncrypted:   addrEnc,
		City:               cmd.City,
		Province:           cmd.Province,
		FundsOrigin:        cmd.FundsOrigin,
		IsPEP:              cmd.IsPEP,
		IsObligatedSubject: cmd.IsObligatedSubject,
		KYCStatus:          user.KYCPending,
	}

	if err := s.repo.SaveInvestorProfile(ctx, profile); err != nil {
		return nil, err
	}
	return profile, nil
}

func (s *UserService) GetInvestorProfile(ctx context.Context, userID string) (*DecryptedInvestorProfile, error) {
	p, err := s.repo.FindInvestorProfileByUserID(ctx, userID)
	if err != nil || p == nil {
		return nil, ErrProfileNotFound
	}

	dniDec, _ := s.encryptor.Decrypt(p.DNIEncrypted)
	cuilDec, _ := s.encryptor.Decrypt(p.CUILEncrypted)
	addrDec, _ := s.encryptor.Decrypt(p.AddressEncrypted)

	return &DecryptedInvestorProfile{
		ID:                 p.ID,
		UserID:             p.UserID,
		FullName:           p.FullName,
		DNI:                dniDec,
		CUIL:               cuilDec,
		BirthDate:          p.BirthDate,
		Address:            addrDec,
		City:               p.City,
		Province:           p.Province,
		FundsOrigin:        p.FundsOrigin,
		IsPEP:              p.IsPEP,
		IsObligatedSubject: p.IsObligatedSubject,
		KYCStatus:          p.KYCStatus,
		VerifiedAt:         p.VerifiedAt,
	}, nil
}

func (s *UserService) UpdateKYCStatus(ctx context.Context, userID string, status user.KYCStatus) error {
	u, err := s.repo.FindUserByID(ctx, userID)
	if err != nil || u == nil {
		return ErrUserNotFound
	}
	return s.repo.UpdateKYCStatus(ctx, userID, status)
}

func (s *UserService) RecordConsent(ctx context.Context, cmd RecordConsentCommand) error {
	consent := &user.LegalConsent{
		ID:              s.ids.NewID(),
		UserID:          cmd.UserID,
		ConsentType:     cmd.ConsentType,
		DocumentVersion: cmd.DocumentVersion,
		DocumentHash:    cmd.DocumentHash,
		IPAddress:       cmd.IPAddress,
		AcceptedAt:      s.clock.Now(),
	}
	return s.repo.SaveLegalConsent(ctx, consent)
}
