package services_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/maurobanegas43/proyecto_final/backend/internal/adapters/outbound/memory"
	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/fund"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
)

func TestFundService_InvestKYCRequirementAndDoubleEntry(t *testing.T) {
	ctx := context.Background()
	fundRepo := memory.NewFundRepository()
	projectRepo := memory.NewProjectRepository()
	userRepo := memory.NewUserRepository()
	idGen := memory.RandomID{}
	clock := memory.SystemClock{}

	fundSvc := services.NewFundService(fundRepo, projectRepo, userRepo, idGen, clock)

	// 1. Setup User and unverified profile
	userID := "user-investor-1"
	u := &user.User{ID: userID, Email: "inv@test.com", Role: user.RoleInvestor, IsActive: true}
	_ = userRepo.SaveUser(ctx, u)

	profile := &user.InvestorProfile{
		ID:        "prof-1",
		UserID:    userID,
		FullName:  "Test Investor",
		KYCStatus: user.KYCPending, // NOT verified yet
	}
	_ = userRepo.SaveInvestorProfile(ctx, profile)

	// Setup Project
	projectID := "proj-tower-1"
	proj, _ := project.New(projectID, "dev-1", "Torre Krea", "Buenos Aires", "Edificio residencial", 50000000, time.Now())
	proj.Status = project.StatusPublished
	_ = projectRepo.Save(ctx, proj)

	// 2. Attempt Investment before KYC -> MUST FAIL with ErrKYCNotVerified
	_, err := fundSvc.InvestInProject(ctx, services.CreateInvestmentCommand{
		ProjectID:   projectID,
		InvestorID:  userID,
		AmountCents: 1000000,
	})
	if !errors.Is(err, user.ErrKYCNotVerified) {
		t.Fatalf("expected ErrKYCNotVerified, got: %v", err)
	}

	// 3. Verify KYC
	_ = userRepo.UpdateKYCStatus(ctx, userID, user.KYCVerified)

	// 4. Attempt Investment after KYC -> MUST SUCCEED
	inv, err := fundSvc.InvestInProject(ctx, services.CreateInvestmentCommand{
		ProjectID:   projectID,
		InvestorID:  userID,
		AmountCents: 1000000,
	})
	if err != nil {
		t.Fatalf("unexpected error investing after KYC: %v", err)
	}

	if inv.AmountCents != 1000000 {
		t.Errorf("expected 1000000 cents, got %d", inv.AmountCents)
	}

	// 5. Verify double-entry ledger accounts and balances
	escrowAcc, err := fundRepo.FindLedgerAccountByUser(ctx, projectID, fund.AccountFiatEscrow)
	if err != nil || escrowAcc == nil {
		t.Fatalf("escrow ledger account not created")
	}

	escrowBal, err := fundSvc.GetAccountBalance(ctx, escrowAcc.ID)
	if err != nil {
		t.Fatalf("failed to get escrow balance: %v", err)
	}
	if escrowBal != 1000000 {
		t.Errorf("expected escrow credit balance of 1000000, got %d", escrowBal)
	}

	investorAcc, err := fundRepo.FindLedgerAccountByUser(ctx, userID, fund.AccountInvestor)
	if err != nil || investorAcc == nil {
		t.Fatalf("investor ledger account not created")
	}

	investorBal, err := fundSvc.GetAccountBalance(ctx, investorAcc.ID)
	if err != nil {
		t.Fatalf("failed to get investor balance: %v", err)
	}
	if investorBal != -1000000 {
		t.Errorf("expected investor debit balance of -1000000, got %d", investorBal)
	}

	// Net ledger balance across escrow and investor must sum to zero
	if escrowBal+investorBal != 0 {
		t.Errorf("expected zero-sum ledger balance, got %d", escrowBal+investorBal)
	}

	// 6. Verify Project funds raised was updated
	updatedProj, _ := projectRepo.FindByID(ctx, projectID)
	if updatedProj.FundsRaised != 1000000 {
		t.Errorf("expected project funds raised 1000000, got %d", updatedProj.FundsRaised)
	}
}
