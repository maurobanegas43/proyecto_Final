package google

import (
	"context"
	"testing"
)

func TestTokenVerifier_EmptyToken(t *testing.T) {
	v := NewTokenVerifier("test-client-id")
	_, err := v.VerifyIDToken(context.Background(), "")
	if err != ErrEmptyToken {
		t.Fatalf("expected ErrEmptyToken, got: %v", err)
	}
}

func TestTokenVerifier_MissingClientID(t *testing.T) {
	v := NewTokenVerifier("")
	_, err := v.VerifyIDToken(context.Background(), "some-token")
	if err != ErrTokenNotConfigured {
		t.Fatalf("expected ErrTokenNotConfigured, got: %v", err)
	}
}
