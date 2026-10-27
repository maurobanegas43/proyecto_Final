// Package config loads runtime configuration from environment variables.
package config

import "os"

type Config struct {
	Port             string
	AllowedOrigin    string
	DatabaseURL      string
	EncryptionKeyHex string
}

func Load() Config {
	return Config{
		Port:             getEnv("API_PORT", "8080"),
		AllowedOrigin:    getEnv("CORS_ALLOWED_ORIGIN", "http://localhost:5173"),
		DatabaseURL:      getEnv("DATABASE_URL", ""),
		// Default 32-byte key for AES-256 in local development
		EncryptionKeyHex: getEnv("PII_ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
