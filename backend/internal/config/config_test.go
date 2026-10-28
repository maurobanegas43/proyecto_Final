package config

import (
	"testing"
)

func TestConfigLoadWithEnvFile(t *testing.T) {
	cfg := Load()
	if cfg.GoogleClientID == "" {
		t.Errorf("expected non-empty GoogleClientID from .env file, got empty")
	}
	expectedSuffix := ".apps.googleusercontent.com"
	if len(cfg.GoogleClientID) < len(expectedSuffix) || cfg.GoogleClientID[len(cfg.GoogleClientID)-len(expectedSuffix):] != expectedSuffix {
		t.Errorf("expected GoogleClientID to end with %s, got %s", expectedSuffix, cfg.GoogleClientID)
	}
}
