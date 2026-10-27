// Command api is the composition root: it wires ports to concrete adapters.
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	httpgin "github.com/maurobanegas43/proyecto_final/backend/internal/adapters/inbound/http/gin"
	"github.com/maurobanegas43/proyecto_final/backend/internal/adapters/outbound/memory"
	"github.com/maurobanegas43/proyecto_final/backend/internal/application/services"
	"github.com/maurobanegas43/proyecto_final/backend/internal/config"
)

func main() {
	cfg := config.Load()

	// Outbound adapters (in-memory until the PostgreSQL adapter lands).
	projectRepo := memory.NewProjectRepository()

	// Application services.
	projectSvc := services.NewProjectService(projectRepo, memory.RandomID{}, memory.SystemClock{})

	// Inbound HTTP adapter.
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), cors(cfg.AllowedOrigin))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
	httpgin.NewProjectHandler(projectSvc).Register(v1)

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
