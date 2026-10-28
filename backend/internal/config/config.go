// Package config loads runtime configuration from environment variables.
package config

import (
	"os"
	"strings"
)

type Config struct {
	Port             string
	AllowedOrigin    string
	DatabaseURL      string
	EncryptionKeyHex string
	GoogleClientID   string
}

func Load() Config {
	loadDotEnv()

	return Config{
		Port:             getEnv("API_PORT", "8080"),
		AllowedOrigin:    getEnv("CORS_ALLOWED_ORIGIN", "http://localhost:5173"),
		DatabaseURL:      getEnv("DATABASE_URL", ""),
		// Default 32-byte key for AES-256 in local development
		EncryptionKeyHex: getEnv("PII_ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
		GoogleClientID:   getEnv("GOOGLE_CLIENT_ID", ""),
	}
}

func loadDotEnv() {
	paths := []string{".env", "../.env", "../../.env"}
	for _, p := range paths {
		data, err := os.ReadFile(p)
		if err != nil {
			continue
		}
		lines := strings.Split(string(data), "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				k := strings.TrimSpace(parts[0])
				v := strings.Trim(strings.TrimSpace(parts[1]), `"'`)
				if _, exists := os.LookupEnv(k); !exists {
					_ = os.Setenv(k, v)
				}
			}
		}
		break
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
