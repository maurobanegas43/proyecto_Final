package services

import (
	"context"
	"errors"

	"github.com/maurobanegas43/proyecto_final/backend/internal/application/ports"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/fund"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
)

var (
	ErrProjectNotInvestable = errors.New("fund: project is not published or open for investment")
)

type CreateInvestmentCommand struct {
	ProjectID   string
	InvestorID  string
	AmountCents int64
}

type FundService struct {
	fundRepo    ports.FundRepository
	projectRepo ports.ProjectRepository
	userRepo    ports.UserRepository
	ids         ports.IDGenerator
	clock       ports.Clock
}

func NewFundService(
	fundRepo ports.FundRepository,
	projectRepo ports.ProjectRepository,
	userRepo ports.UserRepository,
	ids ports.IDGenerator,
	clock ports.Clock,
) *FundService {
	return &FundService{
		fundRepo:    fundRepo,
		projectRepo: projectRepo,
		userRepo:    userRepo,
		ids:         ids,
		clock:       clock,
	}
}

// InvestInProject executes an investment with regulatory validation and double-entry ledger bookkeeping.
func (s *FundService) InvestInProject(ctx context.Context, cmd CreateInvestmentCommand) (*fund.Investment, error) {
	// 1. Regulatory rule: KYC must be verified before any capital allocation
	investorProfile, err := s.userRepo.FindInvestorProfileByUserID(ctx, cmd.InvestorID)
	if err != nil || investorProfile == nil || investorProfile.KYCStatus != user.KYCVerified {
		return nil, user.ErrKYCNotVerified
	}

	// 2. Validate project state
	proj, err := s.projectRepo.FindByID(ctx, cmd.ProjectID)
	if err != nil || proj == nil {
		return nil, project.ErrNotFound
	}
	if proj.Status != project.StatusPublished && proj.Status != project.StatusApproved {
		return nil, ErrProjectNotInvestable
	}

	now := s.clock.Now()
	invID := s.ids.NewID()
	inv, err := fund.NewInvestment(invID, cmd.ProjectID, cmd.InvestorID, cmd.AmountCents, now)
	if err != nil {
		return nil, err
	}

	// 3. Resolve or initialize ledger accounts
	investorAcc, err := s.fundRepo.FindLedgerAccountByUser(ctx, cmd.InvestorID, fund.AccountInvestor)
	if err != nil || investorAcc == nil {
		investorAcc = &fund.LedgerAccount{
			ID:          s.ids.NewID(),
			UserID:      &cmd.InvestorID,
			AccountType: fund.AccountInvestor,
			Currency:    "USD",
			IsActive:    true,
			CreatedAt:   now,
		}
		if err := s.fundRepo.SaveLedgerAccount(ctx, investorAcc); err != nil {
			return nil, err
		}
	}

	escrowAcc, err := s.fundRepo.FindLedgerAccountByUser(ctx, cmd.ProjectID, fund.AccountFiatEscrow)
	if err != nil || escrowAcc == nil {
		escrowAcc = &fund.LedgerAccount{
			ID:          s.ids.NewID(),
			UserID:      &cmd.ProjectID,
			AccountType: fund.AccountFiatEscrow,
			Currency:    "USD",
			IsActive:    true,
			CreatedAt:   now,
		}
		if err := s.fundRepo.SaveLedgerAccount(ctx, escrowAcc); err != nil {
			return nil, err
		}
	}

	// 4. Generate balanced double-entry transaction (Zero-Sum Rule)
	txGroupID := s.ids.NewID()
	entries := []fund.LedgerEntry{
		{
			ID:                 s.ids.NewID(),
			AccountID:          investorAcc.ID,
			TransactionGroupID: txGroupID,
			EntryType:          fund.EntryDebit,
			AmountCents:        cmd.AmountCents,
			ReferenceType:      "investment",
			ReferenceID:        invID,
			CreatedAt:          now,
		},
		{
			ID:                 s.ids.NewID(),
			AccountID:          escrowAcc.ID,
			TransactionGroupID: txGroupID,
			EntryType:          fund.EntryCredit,
			AmountCents:        cmd.AmountCents,
			ReferenceType:      "investment",
			ReferenceID:        invID,
			CreatedAt:          now,
		},
	}

	if err := fund.ValidateTransactionPair(entries); err != nil {
		return nil, err
	}

	// 5. Persist investment and transaction in atomic storage
	if err := s.fundRepo.SaveInvestment(ctx, inv); err != nil {
		return nil, err
	}

	if err := s.fundRepo.RecordTransaction(ctx, entries); err != nil {
		return nil, err
	}

	// 6. Update project raised funds
	proj.FundsRaised += project.Money(cmd.AmountCents)
	_ = s.projectRepo.Save(ctx, proj)

	return inv, nil
}

func (s *FundService) GetInvestment(ctx context.Context, id string) (*fund.Investment, error) {
	return s.fundRepo.FindInvestmentByID(ctx, id)
}

func (s *FundService) GetAccountBalance(ctx context.Context, accountID string) (int64, error) {
	return s.fundRepo.GetAccountBalance(ctx, accountID)
}

func (s *FundService) ListInvestmentsByInvestor(ctx context.Context, investorID string) ([]*fund.Investment, error) {
	return s.fundRepo.ListInvestmentsByInvestor(ctx, investorID)
}
