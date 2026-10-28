package google

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"google.golang.org/api/idtoken"

	"github.com/maurobanegas43/proyecto_final/backend/internal/application/ports"
)

var (
	ErrEmptyToken         = errors.New("google: id token cannot be empty")
	ErrTokenNotConfigured = errors.New("google: client ID is not configured on server")
	ErrEmailNotVerified   = errors.New("google: email address is not verified by Google")
	ErrInvalidDomain      = errors.New("google: email must belong to @gmail.com or authorized domain")
)

type TokenVerifier struct {
	clientID string
}

func NewTokenVerifier(clientID string) *TokenVerifier {
	return &TokenVerifier{clientID: strings.TrimSpace(clientID)}
}

func (v *TokenVerifier) VerifyIDToken(ctx context.Context, tokenString string) (*ports.GoogleClaims, error) {
	cleanToken := strings.TrimSpace(tokenString)
	if cleanToken == "" {
		return nil, ErrEmptyToken
	}

	if v.clientID == "" {
		return nil, ErrTokenNotConfigured
	}

	payload, err := idtoken.Validate(ctx, cleanToken, v.clientID)
	if err != nil {
		return nil, fmt.Errorf("google: token validation failed: %w", err)
	}

	email, _ := payload.Claims["email"].(string)
	emailVerified, _ := payload.Claims["email_verified"].(bool)
	name, _ := payload.Claims["name"].(string)
	picture, _ := payload.Claims["picture"].(string)

	if !emailVerified {
		return nil, ErrEmailNotVerified
	}

	cleanEmail := strings.ToLower(strings.TrimSpace(email))
	if !strings.HasSuffix(cleanEmail, "@gmail.com") && !strings.HasSuffix(cleanEmail, "@googlemail.com") {
		return nil, ErrInvalidDomain
	}

	return &ports.GoogleClaims{
		Email:         cleanEmail,
		EmailVerified: emailVerified,
		Subject:       payload.Subject,
		Name:          name,
		Picture:       picture,
	}, nil
}
