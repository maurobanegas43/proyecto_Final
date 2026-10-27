package crypto

import (
	"crypto/rand"
	"testing"
)

func TestAESGCMEncryptor(t *testing.T) {
	key := make([]byte, 32)
	if _, err := rand.Read(key); err != nil {
		t.Fatalf("failed to generate random key: %v", err)
	}

	encryptor, err := NewAESGCMEncryptor(key)
	if err != nil {
		t.Fatalf("unexpected error creating encryptor: %v", err)
	}

	secret := "DNI-40123456-ARG"
	encrypted, err := encryptor.Encrypt(secret)
	if err != nil {
		t.Fatalf("failed to encrypt: %v", err)
	}

	if encrypted == secret {
		t.Errorf("encrypted string is identical to plaintext")
	}

	decrypted, err := encryptor.Decrypt(encrypted)
	if err != nil {
		t.Fatalf("failed to decrypt: %v", err)
	}

	if decrypted != secret {
		t.Errorf("expected %q, got %q", secret, decrypted)
	}
}

func TestBcryptHasher(t *testing.T) {
	hasher := NewBcryptHasher(10)
	rawPassword := "SuperSecurePass123!"

	hash, err := hasher.HashPassword(rawPassword)
	if err != nil {
		t.Fatalf("failed to hash password: %v", err)
	}

	if err := hasher.ComparePassword(hash, rawPassword); err != nil {
		t.Errorf("expected valid password comparison, got error: %v", err)
	}

	if err := hasher.ComparePassword(hash, "WrongPassword"); err == nil {
		t.Errorf("expected comparison error for incorrect password")
	}
}
