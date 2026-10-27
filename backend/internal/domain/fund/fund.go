// Package fund models financial operations, investment commitments, and the immutable
// double-entry ledger for fund movements in the relational database.
package fund

import (
	"errors"
	"time"
)

type InvestmentStatus string

const (
	InvestmentPending   InvestmentStatus = "pending"
	InvestmentActive    InvestmentStatus = "active"
	InvestmentCancelled InvestmentStatus = "cancelled"
	InvestmentCompleted InvestmentStatus = "completed"
)

type AccountType string

const (
	AccountFiatEscrow   AccountType = "fiat_escrow"
	AccountInvestor     AccountType = "investor_wallet"
	AccountPlatformFee  AccountType = "platform_fee"
)

type EntryType string

const (
	EntryDebit  EntryType = "DEBIT"
	EntryCredit EntryType = "CREDIT"
)

var (
	ErrInvalidAmount         = errors.New("fund: amount must be strictly greater than zero")
	ErrUnbalancedTransaction = errors.New("fund: double-entry transaction must sum to zero (debits equal credits)")
	ErrInvestmentNotFound    = errors.New("fund: investment not found")
	ErrAccountNotFound       = errors.New("fund: ledger account not found")
	ErrInsufficientBalance   = errors.New("fund: insufficient funds in account")
)

// Investment represents a direct capital commitment to a project/fund.
type Investment struct {
	ID          string
	ProjectID   string
	InvestorID  string
	AmountCents int64
	Status      InvestmentStatus
	CreatedAt   time.Time
}

// NewInvestment validates the financial commitment.
func NewInvestment(id, projectID, investorID string, amountCents int64, now time.Time) (*Investment, error) {
	if amountCents <= 0 {
		return nil, ErrInvalidAmount
	}
	return &Investment{
		ID:          id,
		ProjectID:   projectID,
		InvestorID:  investorID,
		AmountCents: amountCents,
		Status:      InvestmentPending,
		CreatedAt:   now,
	}, nil
}

// LedgerAccount represents a balance-holding account in the relational ledger.
type LedgerAccount struct {
	ID          string
	UserID      *string // NULL for system-level accounts (e.g., escrow or fee pool)
	AccountType AccountType
	Currency    string
	IsActive    bool
	CreatedAt   time.Time
}

// LedgerEntry is an immutable transaction record adhering to double-entry accounting.
type LedgerEntry struct {
	ID                 string
	AccountID          string
	TransactionGroupID string // Shared across paired debit/credit entries
	EntryType          EntryType
	AmountCents        int64
	ReferenceType      string // "investment", "deposit", "fee", "yield"
	ReferenceID        string
	CreatedAt          time.Time
}

// ValidateTransactionPair checks that the transaction group maintains zero-sum equilibrium.
func ValidateTransactionPair(entries []LedgerEntry) error {
	if len(entries) < 2 {
		return ErrUnbalancedTransaction
	}

	var totalDebit, totalCredit int64
	for _, entry := range entries {
		if entry.AmountCents <= 0 {
			return ErrInvalidAmount
		}
		switch entry.EntryType {
		case EntryDebit:
			totalDebit += entry.AmountCents
		case EntryCredit:
			totalCredit += entry.AmountCents
		default:
			return ErrUnbalancedTransaction
		}
	}

	if totalDebit != totalCredit {
		return ErrUnbalancedTransaction
	}
	return nil
}
