package gin_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"

	httpgin "github.com/maurobanegas43/proyecto_final/backend/internal/adapters/inbound/http/gin"
	"github.com/maurobanegas43/proyecto_final/backend/internal/adapters/outbound/memory"
	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/project"
	"github.com/maurobanegas43/proyecto_final/backend/internal/domain/user"
	"github.com/maurobanegas43/proyecto_final/backend/internal/security/crypto"
)

func setupTestRouter() (*gin.Engine, *services.UserService, *services.FundService, *services.ProjectService) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	key := []byte("12345678901234567890123456789012")
	encryptor, _ := crypto.NewAESGCMEncryptor(key)
	hasher := crypto.NewBcryptHasher(10)
	idGen := memory.RandomID{}
	clock := memory.SystemClock{}

	userRepo := memory.NewUserRepository()
	projectRepo := memory.NewProjectRepository()
	fundRepo := memory.NewFundRepository()

	userSvc := services.NewUserService(userRepo, encryptor, hasher, idGen, clock)
	fundSvc := services.NewFundService(fundRepo, projectRepo, userRepo, idGen, clock)
	projectSvc := services.NewProjectService(projectRepo, idGen, clock)

	v1 := r.Group("/api/v1")
	httpgin.NewUserHandler(userSvc).Register(v1)
	httpgin.NewFundHandler(fundSvc).Register(v1)
	httpgin.NewProjectHandler(projectSvc).Register(v1)

	return r, userSvc, fundSvc, projectSvc
}

func TestUserAndFundEndpoints_E2E(t *testing.T) {
	r, _, _, projectSvc := setupTestRouter()

	// 1. Test POST /api/v1/users/register
	regPayload := map[string]interface{}{
		"email":    "investor.test@gmail.com",
		"phone":    "+54 9 11 1234-5678",
		"password": "Password1234!",
		"role":     "investor",
		"userType": "individual",
	}
	body, _ := json.Marshal(regPayload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/users/register", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201 Created on register, got %d: %s", w.Code, w.Body.String())
	}

	var regResp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &regResp)
	userID := regResp["id"].(string)

	// 2. Test POST /api/v1/users/:id/investor-profile (encrypting PII)
	profPayload := map[string]interface{}{
		"fullName":           "Mariano Lopez",
		"dni":                "35123456",
		"cuil":               "20-35123456-9",
		"birthDate":          "1988-10-20",
		"address":            "Av. Libertador 4500",
		"city":               "Buenos Aires",
		"province":           "CABA",
		"fundsOrigin":        "Ahorros bancarios",
		"isPep":              false,
		"isObligatedSubject": false,
	}
	body, _ = json.Marshal(profPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/users/"+userID+"/investor-profile", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on save profile, got %d: %s", w.Code, w.Body.String())
	}

	// 3. Test GET /api/v1/users/:id/investor-profile (decrypted verification)
	req = httptest.NewRequest(http.MethodGet, "/api/v1/users/"+userID+"/investor-profile", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on get profile, got %d: %s", w.Code, w.Body.String())
	}

	// 4. Create and publish a project
	proj, _ := projectSvc.CreateProject(req.Context(), services.CreateProjectCommand{
		DeveloperID: "dev-01",
		Name:        "Residencias Krea",
		Location:    "Palermo, CABA",
		Description: "Edificio premium",
		FundingGoal: 100000000,
	})
	_, _ = projectSvc.SubmitForReview(req.Context(), proj.ID)
	_, _ = projectSvc.ApproveProject(req.Context(), proj.ID)
	proj.Status = project.StatusPublished // Set published

	// 5. Attempt investment when KYC is pending -> expect 403 Forbidden
	invPayload := map[string]interface{}{
		"projectId":   proj.ID,
		"investorId":  userID,
		"amountCents": 500000,
	}
	body, _ = json.Marshal(invPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/funds/investments", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden when KYC pending, got %d: %s", w.Code, w.Body.String())
	}

	// 6. Verify KYC via endpoint POST /api/v1/users/:id/kyc
	kycPayload := map[string]interface{}{"status": "verified"}
	body, _ = json.Marshal(kycPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/users/"+userID+"/kyc", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 OK on update KYC, got %d: %s", w.Code, w.Body.String())
	}

	// 7. Re-attempt investment -> expect 201 Created
	body, _ = json.Marshal(invPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/funds/investments", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201 Created on investment after KYC verified, got %d: %s", w.Code, w.Body.String())
	}
}

var _ = time.Now
var _ = user.KYCVerified
