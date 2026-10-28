package ports

import "context"

// GoogleClaims holds the verified claims extracted from a Google ID Token.
type GoogleClaims struct {
	Email         string
	EmailVerified bool
	Subject       string
	Name          string
	Picture       string
}

// GoogleTokenVerifier defines the contract for verifying Google Identity Services ID Tokens.
type GoogleTokenVerifier interface {
	VerifyIDToken(ctx context.Context, idToken string) (*GoogleClaims, error)
}
