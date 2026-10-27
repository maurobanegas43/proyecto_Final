package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/fund"
)

type FundRepository struct {
	pool *pgxpool.Pool
}

func NewFundRepository(pool *pgxpool.Pool) *FundRepository {
	return &FundRepository{pool: pool}
}

func (r *FundRepository) SaveInvestment(ctx context.Context, inv *fund.Investment) error {
	query := `
		INSERT INTO investments (id, project_id, investor_id, amount_cents, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (id) DO UPDATE SET
			status = EXCLUDED.status
	`
	_, err := r.pool.Exec(ctx, query,
		inv.ID, inv.ProjectID, inv.InvestorID, inv.AmountCents, string(inv.Status), inv.CreatedAt,
	)
	return err
}

func (r *FundRepository) FindInvestmentByID(ctx context.Context, id string) (*fund.Investment, error) {
	query := `SELECT id, project_id, investor_id, amount_cents, status, created_at FROM investments WHERE id = $1`
	row := r.pool.QueryRow(ctx, query, id)

	var inv fund.Investment
	var status string
	err := row.Scan(&inv.ID, &inv.ProjectID, &inv.InvestorID, &inv.AmountCents, &status, &inv.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	inv.Status = fund.InvestmentStatus(status)
	return &inv, nil
}

func (r *FundRepository) ListInvestmentsByProject(ctx context.Context, projectID string) ([]*fund.Investment, error) {
	query := `SELECT id, project_id, investor_id, amount_cents, status, created_at FROM investments WHERE project_id = $1 ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, query, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*fund.Investment
	for rows.Next() {
		var inv fund.Investment
		var status string
		if err := rows.Scan(&inv.ID, &inv.ProjectID, &inv.InvestorID, &inv.AmountCents, &status, &inv.CreatedAt); err != nil {
			return nil, err
		}
		inv.Status = fund.InvestmentStatus(status)
		result = append(result, &inv)
	}
	return result, rows.Err()
}

func (r *FundRepository) ListInvestmentsByInvestor(ctx context.Context, investorID string) ([]*fund.Investment, error) {
	query := `SELECT id, project_id, investor_id, amount_cents, status, created_at FROM investments WHERE investor_id = $1 ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, query, investorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*fund.Investment
	for rows.Next() {
		var inv fund.Investment
		var status string
		if err := rows.Scan(&inv.ID, &inv.ProjectID, &inv.InvestorID, &inv.AmountCents, &status, &inv.CreatedAt); err != nil {
			return nil, err
		}
		inv.Status = fund.InvestmentStatus(status)
		result = append(result, &inv)
	}
	return result, rows.Err()
}

func (r *FundRepository) SaveLedgerAccount(ctx context.Context, acc *fund.LedgerAccount) error {
	query := `
		INSERT INTO ledger_accounts (id, user_id, account_type, currency, is_active, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (id) DO UPDATE SET
			is_active = EXCLUDED.is_active
	`
	_, err := r.pool.Exec(ctx, query,
		acc.ID, acc.UserID, string(acc.AccountType), acc.Currency, acc.IsActive, acc.CreatedAt,
	)
	return err
}

func (r *FundRepository) FindLedgerAccountByID(ctx context.Context, id string) (*fund.LedgerAccount, error) {
	query := `SELECT id, user_id, account_type, currency, is_active, created_at FROM ledger_accounts WHERE id = $1`
	row := r.pool.QueryRow(ctx, query, id)

	var acc fund.LedgerAccount
	var accType string
	err := row.Scan(&acc.ID, &acc.UserID, &accType, &acc.Currency, &acc.IsActive, &acc.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	acc.AccountType = fund.AccountType(accType)
	return &acc, nil
}

func (r *FundRepository) FindLedgerAccountByUser(ctx context.Context, userID string, accType fund.AccountType) (*fund.LedgerAccount, error) {
	query := `SELECT id, user_id, account_type, currency, is_active, created_at FROM ledger_accounts WHERE user_id = $1 AND account_type = $2`
	row := r.pool.QueryRow(ctx, query, userID, string(accType))

	var acc fund.LedgerAccount
	var aType string
	err := row.Scan(&acc.ID, &acc.UserID, &aType, &acc.Currency, &acc.IsActive, &acc.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	acc.AccountType = fund.AccountType(aType)
	return &acc, nil
}

// RecordTransaction writes paired debit/credit entries in a single atomic database transaction.
func (r *FundRepository) RecordTransaction(ctx context.Context, entries []fund.LedgerEntry) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx) // Safe no-op if tx.Commit succeeded

	query := `
		INSERT INTO ledger_entries (id, account_id, transaction_group_id, entry_type, amount_cents, reference_type, reference_id, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	for _, entry := range entries {
		_, err := tx.Exec(ctx, query,
			entry.ID, entry.AccountID, entry.TransactionGroupID, string(entry.EntryType),
			entry.AmountCents, entry.ReferenceType, entry.ReferenceID, entry.CreatedAt,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// GetAccountBalance calculates the net balance from double-entry records.
func (r *FundRepository) GetAccountBalance(ctx context.Context, accountID string) (int64, error) {
	query := `
		SELECT COALESCE(SUM(CASE WHEN entry_type = 'CREDIT' THEN amount_cents ELSE -amount_cents END), 0)
		FROM ledger_entries
		WHERE account_id = $1
	`
	var balance int64
	err := r.pool.QueryRow(ctx, query, accountID).Scan(&balance)
	return balance, err
}
