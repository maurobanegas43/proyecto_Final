package services_test

import (
	"context"
	"testing"
	"time"

	"github.com/maurobanegas43/proyecto_final/backend/internal/adapters/outbound/memory"
	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
	"github.com/maurobanegas43/proyecto_final/backend/internal/security/crypto"
)

func TestUserService_RegisterAndPIIEncryption(t *testing.T) {
	ctx := context.Background()
	userRepo := memory.NewUserRepository()
	key := []byte("12345678901234567890123456789012")
	encryptor, _ := crypto.NewAESGCMEncryptor(key)
	hasher := crypto.NewBcryptHasher(10)
	idGen := memory.RandomID{}
	clock := memory.SystemClock{}

	svc := services.NewUserService(userRepo, encryptor, hasher, idGen, clock)

	// 1. Register User with valid Gmail and valid Phone
	u, err := svc.RegisterUser(ctx, services.RegisterUserCommand{
		Email:    "investor.test@gmail.com",
		Phone:    "+5491112345678",
		Password: "SecurePassword123!",
		Role:     user.RoleInvestor,
		UserType: user.UserTypeIndividual,
	})
	if err != nil {
		t.Fatalf("unexpected error registering user: %v", err)
	}
	if u.ID == "" {
		t.Errorf("expected non-empty user ID")
	}

	// 2. Save Investor Profile with sensitive PII
	rawDNI := "40123456"
	rawCUIL := "20-40123456-7"
	rawAddress := "Av. Corrientes 1234, CABA"

	profile, err := svc.SaveInvestorProfile(ctx, services.SaveInvestorProfileCommand{
		UserID:             u.ID,
		FullName:           "Carlos Perez",
		DNI:                rawDNI,
		CUIL:               rawCUIL,
		BirthDate:          "1990-05-15",
		Address:            rawAddress,
		City:               "Buenos Aires",
		Province:           "CABA",
		FundsOrigin:        "Salario",
		IsPEP:              false,
		IsObligatedSubject: false,
	})
	if err != nil {
		t.Fatalf("unexpected error saving profile: %v", err)
	}
	if profile.ID == "" {
		t.Errorf("expected generated profile ID")
	}

	// Verify in repository that raw PII is NOT stored in plain text
	rawStored, err := userRepo.FindInvestorProfileByUserID(ctx, u.ID)
	if err != nil || rawStored == nil {
		t.Fatalf("profile not found in repo")
	}
	if rawStored.DNIEncrypted == rawDNI {
		t.Errorf("DNI stored in plain text!")
	}
	if rawStored.CUILEncrypted == rawCUIL {
		t.Errorf("CUIL stored in plain text!")
	}
	if rawStored.AddressEncrypted == rawAddress {
		t.Errorf("Address stored in plain text!")
	}

	// 3. Retrieve decrypted profile for authorized service consumption
	decrypted, err := svc.GetInvestorProfile(ctx, u.ID)
	if err != nil {
		t.Fatalf("unexpected error getting profile: %v", err)
	}
	if decrypted.DNI != rawDNI {
		t.Errorf("expected decrypted DNI %s, got %s", rawDNI, decrypted.DNI)
	}
	if decrypted.CUIL != rawCUIL {
		t.Errorf("expected decrypted CUIL %s, got %s", rawCUIL, decrypted.CUIL)
	}
	if decrypted.Address != rawAddress {
		t.Errorf("expected decrypted address %s, got %s", rawAddress, decrypted.Address)
	}

	// 4. Update KYC Status
	if err := svc.UpdateKYCStatus(ctx, u.ID, user.KYCVerified); err != nil {
		t.Fatalf("failed to update KYC status: %v", err)
	}

	updated, _ := svc.GetInvestorProfile(ctx, u.ID)
	if updated.KYCStatus != user.KYCVerified {
		t.Errorf("expected KYC status %s, got %s", user.KYCVerified, updated.KYCStatus)
	}
}

func TestUserService_LegalConsent(t *testing.T) {
	ctx := context.Background()
	userRepo := memory.NewUserRepository()
	key := []byte("12345678901234567890123456789012")
	encryptor, _ := crypto.NewAESGCMEncryptor(key)
	hasher := crypto.NewBcryptHasher(10)
	svc := services.NewUserService(userRepo, encryptor, hasher, memory.RandomID{}, memory.SystemClock{})

	err := svc.RecordConsent(ctx, services.RecordConsentCommand{
		UserID:          "usr-123",
		ConsentType:     user.ConsentTermsAndConditions,
		DocumentVersion: "v1.2",
		DocumentHash:    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
		IPAddress:       "190.12.34.56",
	})
	if err != nil {
		t.Fatalf("failed to record consent: %v", err)
	}
}

func TestUserService_ValidationFailures(t *testing.T) {
	ctx := context.Background()
	userRepo := memory.NewUserRepository()
	key := []byte("12345678901234567890123456789012")
	encryptor, _ := crypto.NewAESGCMEncryptor(key)
	hasher := crypto.NewBcryptHasher(10)
	svc := services.NewUserService(userRepo, encryptor, hasher, memory.RandomID{}, memory.SystemClock{})

	// 1. Invalid domain (not gmail)
	_, err := svc.RegisterUser(ctx, services.RegisterUserCommand{
		Email:    "test@outlook.com",
		Phone:    "+5491112345678",
		Password: "ValidPass123!",
		Role:     user.RoleInvestor,
		UserType: user.UserTypeIndividual,
	})
	if err == nil {
		t.Errorf("expected error for non-gmail domain")
	}

	// 2. Invalid phone
	_, err = svc.RegisterUser(ctx, services.RegisterUserCommand{
		Email:    "validuser@gmail.com",
		Phone:    "123",
		Password: "ValidPass123!",
		Role:     user.RoleInvestor,
		UserType: user.UserTypeIndividual,
	})
	if err == nil {
		t.Errorf("expected error for invalid phone number")
	}

	// 3. Weak password
	_, err = svc.RegisterUser(ctx, services.RegisterUserCommand{
		Email:    "validuser@gmail.com",
		Phone:    "+5491112345678",
		Password: "weak",
		Role:     user.RoleInvestor,
		UserType: user.UserTypeIndividual,
	})
	if err == nil {
		t.Errorf("expected error for weak password")
	}
}

// Ensure interface compliance
var _ = time.Now
