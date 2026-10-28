// Command api is the composition root: it wires ports to concrete adapters.
package main

import (
	"context"
	"encoding/hex"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	httpgin "github.com/maurobanegas43/proyecto_final/backend/internal/adapters/inbound/http/gin"
	"github.com/maurobanegas43/proyecto_final/backend/internal/adapters/outbound/memory"
	"github.com/maurobanegas43/proyecto_final/backend/internal/adapters/outbound/postgres"
	"github.com/maurobanegas43/proyecto_final/backend/internal/application/ports"
	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/config"
	"github.com/maurobanegas43/proyecto_final/backend/internal/security/crypto"
	"github.com/maurobanegas43/proyecto_final/backend/internal/security/google"
)

func main() {
	cfg := config.Load()

	// 1. Cryptographic adapters (AES-256-GCM for PII & Bcrypt for passwords)
	encKey, err := hex.DecodeString(cfg.EncryptionKeyHex)
	if err != nil || len(encKey) != 32 {
		log.Printf("warning: invalid or missing 32-byte encryption key in hex, using fallback 32-byte key")
		encKey = []byte("12345678901234567890123456789012")
	}
	encryptor, err := crypto.NewAESGCMEncryptor(encKey)
	if err != nil {
		log.Fatalf("failed to initialize AES-GCM encryptor: %v", err)
	}
	hasher := crypto.NewBcryptHasher(12)

	// 2. Outbound adapters (PostgreSQL if configured, memory fallback)
	var (
		projectRepo ports.ProjectRepository
		userRepo    ports.UserRepository
		fundRepo    ports.FundRepository
	)

	if cfg.DatabaseURL != "" {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		pool, err := postgres.NewPool(ctx, cfg.DatabaseURL)
		if err != nil {
			log.Printf("warning: postgresql connection failed (%v); falling back to memory adapter", err)
			projectRepo = memory.NewProjectRepository()
			userRepo = memory.NewUserRepository()
			fundRepo = memory.NewFundRepository()
		} else {
			log.Println("connected to PostgreSQL successfully")
			projectRepo = postgres.NewProjectRepository(pool)
			userRepo = postgres.NewUserRepository(pool)
			fundRepo = postgres.NewFundRepository(pool)
		}
	} else {
		log.Println("no DATABASE_URL provided; using in-memory adapters")
		projectRepo = memory.NewProjectRepository()
		userRepo = memory.NewUserRepository()
		fundRepo = memory.NewFundRepository()
	}

	idGen := memory.RandomID{}
	clock := memory.SystemClock{}

	// 3. Application services
	projectSvc := services.NewProjectService(projectRepo, idGen, clock)
	userSvc := services.NewUserService(userRepo, encryptor, hasher, idGen, clock)
	if cfg.GoogleClientID != "" {
		log.Println("enabling Google ID Token verification with client id configured")
	}
	userSvc.SetGoogleVerifier(google.NewTokenVerifier(cfg.GoogleClientID))
	fundSvc := services.NewFundService(fundRepo, projectRepo, userRepo, idGen, clock)

	// 4. Inbound HTTP adapter (Gin)
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), cors(cfg.AllowedOrigin))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
	httpgin.NewProjectHandler(projectSvc).Register(v1)
	userHandler := httpgin.NewUserHandler(userSvc)
	userHandler.Register(v1)
	userHandler.RegisterAuthRoutes(v1)
	httpgin.NewFundHandler(fundSvc).Register(v1)

	log.Printf("api listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}

// cors is a restrictive single-origin CORS middleware.
func cors(origin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type,Authorization,Idempotency-Key")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
