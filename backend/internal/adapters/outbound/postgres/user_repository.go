package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) SaveUser(ctx context.Context, u *user.User) error {
	query := `
		INSERT INTO users (id, email, phone, password_hash, role, user_type, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		ON CONFLICT (id) DO UPDATE SET
			email = EXCLUDED.email,
			phone = EXCLUDED.phone,
			password_hash = EXCLUDED.password_hash,
			role = EXCLUDED.role,
			user_type = EXCLUDED.user_type,
			is_active = EXCLUDED.is_active,
			updated_at = EXCLUDED.updated_at
	`
	_, err := r.pool.Exec(ctx, query,
		u.ID, u.Email, u.Phone, u.PasswordHash, string(u.Role), string(u.UserType), u.IsActive, u.CreatedAt, u.UpdatedAt,
	)
	return err
}

func (r *UserRepository) FindUserByID(ctx context.Context, id string) (*user.User, error) {
	query := `SELECT id, email, phone, password_hash, role, user_type, is_active, created_at, updated_at FROM users WHERE id = $1`
	row := r.pool.QueryRow(ctx, query, id)

	var u user.User
	var phone *string
	var role, uType string
	err := row.Scan(&u.ID, &u.Email, &phone, &u.PasswordHash, &role, &uType, &u.IsActive, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	if phone != nil {
		u.Phone = *phone
	}
	u.Role = user.Role(role)
	u.UserType = user.UserType(uType)
	return &u, nil
}

func (r *UserRepository) FindUserByEmail(ctx context.Context, email string) (*user.User, error) {
	query := `SELECT id, email, phone, password_hash, role, user_type, is_active, created_at, updated_at FROM users WHERE email = $1`
	row := r.pool.QueryRow(ctx, query, email)

	var u user.User
	var phone *string
	var role, uType string
	err := row.Scan(&u.ID, &u.Email, &phone, &u.PasswordHash, &role, &uType, &u.IsActive, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	if phone != nil {
		u.Phone = *phone
	}
	u.Role = user.Role(role)
	u.UserType = user.UserType(uType)
	return &u, nil
}

func (r *UserRepository) SaveInvestorProfile(ctx context.Context, p *user.InvestorProfile) error {
	query := `
		INSERT INTO investor_profiles (
			id, user_id, full_name, dni_encrypted, cuil_encrypted, birth_date,
			address_encrypted, city, province, funds_origin, is_pep, is_obligated_subject,
			kyc_status, verified_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		ON CONFLICT (user_id) DO UPDATE SET
			full_name = EXCLUDED.full_name,
			dni_encrypted = EXCLUDED.dni_encrypted,
			cuil_encrypted = EXCLUDED.cuil_encrypted,
			birth_date = EXCLUDED.birth_date,
			address_encrypted = EXCLUDED.address_encrypted,
			city = EXCLUDED.city,
			province = EXCLUDED.province,
			funds_origin = EXCLUDED.funds_origin,
			is_pep = EXCLUDED.is_pep,
			is_obligated_subject = EXCLUDED.is_obligated_subject,
			kyc_status = EXCLUDED.kyc_status,
			verified_at = EXCLUDED.verified_at
	`
	_, err := r.pool.Exec(ctx, query,
		p.ID, p.UserID, p.FullName, p.DNIEncrypted, p.CUILEncrypted, p.BirthDate,
		p.AddressEncrypted, p.City, p.Province, p.FundsOrigin, p.IsPEP, p.IsObligatedSubject,
		string(p.KYCStatus), p.VerifiedAt,
	)
	return err
}

func (r *UserRepository) FindInvestorProfileByUserID(ctx context.Context, userID string) (*user.InvestorProfile, error) {
	query := `
		SELECT id, user_id, full_name, dni_encrypted, cuil_encrypted, birth_date,
		       address_encrypted, city, province, funds_origin, is_pep, is_obligated_subject,
		       kyc_status, verified_at
		FROM investor_profiles WHERE user_id = $1
	`
	row := r.pool.QueryRow(ctx, query, userID)

	var p user.InvestorProfile
	var kyc string
	err := row.Scan(
		&p.ID, &p.UserID, &p.FullName, &p.DNIEncrypted, &p.CUILEncrypted, &p.BirthDate,
		&p.AddressEncrypted, &p.City, &p.Province, &p.FundsOrigin, &p.IsPEP, &p.IsObligatedSubject,
		&kyc, &p.VerifiedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	p.KYCStatus = user.KYCStatus(kyc)
	return &p, nil
}

func (r *UserRepository) UpdateKYCStatus(ctx context.Context, userID string, status user.KYCStatus) error {
	query := `UPDATE investor_profiles SET kyc_status = $1, verified_at = CASE WHEN $1::varchar = 'verified' THEN NOW() ELSE NULL END WHERE user_id = $2`
	_, err := r.pool.Exec(ctx, query, string(status), userID)
	return err
}

func (r *UserRepository) SaveLegalConsent(ctx context.Context, consent *user.LegalConsent) error {
	query := `
		INSERT INTO legal_consents (id, user_id, consent_type, document_version, document_hash, ip_address, accepted_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := r.pool.Exec(ctx, query,
		consent.ID, consent.UserID, string(consent.ConsentType), consent.DocumentVersion, consent.DocumentHash, consent.IPAddress, consent.AcceptedAt,
	)
	return err
}
