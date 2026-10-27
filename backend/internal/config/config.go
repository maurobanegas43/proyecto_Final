// Package config loads runtime configuration from environment variables.
package config

import "os"

type Config struct {
	Port          string
	AllowedOrigin string
}

func Load() Config {
	return Config{
		Port:          getEnv("API_PORT", "8080"),
		AllowedOrigin: getEnv("CORS_ALLOWED_ORIGIN", "http://localhost:5173"),
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
