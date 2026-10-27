package validation

import (
	"testing"
)

func TestValidateGmail(t *testing.T) {
	tests := []struct {
		email   string
		wantErr bool
	}{
		{"valid.user@gmail.com", false},
		{"investor2026@gmail.com", false},
		{"googleuser@googlemail.com", false},
		{"invalid-domain@yahoo.com", true},
		{"not-an-email", true},
		{"short@gmail.com", true}, // < 6 chars
		{"consecutive..dots@gmail.com", true},
	}

	for _, tt := range tests {
		_, err := ValidateGmail(tt.email)
		if (err != nil) != tt.wantErr {
			t.Errorf("ValidateGmail(%q) error = %v, wantErr %v", tt.email, err, tt.wantErr)
		}
	}
}

func TestValidateAndFormatPhone(t *testing.T) {
	tests := []struct {
		phone         string
		defaultRegion string
		wantE164      string
		wantErr       bool
	}{
		{"+54 9 11 1234-5678", "AR", "+5491112345678", false},
		{"11 1234-5678", "AR", "+541112345678", false},
		{"+1 202 555 0123", "US", "+12025550123", false},
		{"1234", "AR", "", true},
		{"invalid-phone", "AR", "", true},
	}

	for _, tt := range tests {
		formatted, err := ValidateAndFormatPhone(tt.phone, tt.defaultRegion)
		if (err != nil) != tt.wantErr {
			t.Errorf("ValidateAndFormatPhone(%q) error = %v, wantErr %v", tt.phone, err, tt.wantErr)
		}
		if !tt.wantErr && formatted != tt.wantE164 {
			t.Errorf("ValidateAndFormatPhone(%q) got = %v, want = %v", tt.phone, formatted, tt.wantE164)
		}
	}
}

func TestValidatePasswordStrength(t *testing.T) {
	tests := []struct {
		password string
		wantErr  bool
	}{
		{"StrongPass123!", false},
		{"KreaNova#2026", false},
		{"short1!", true},
		{"alllowercase123!", true},
		{"ALLUPPERCASE123!", true},
		{"NoDigitsHere!", true},
		{"NoSpecialChar123", true},
	}

	for _, tt := range tests {
		err := ValidatePasswordStrength(tt.password)
		if (err != nil) != tt.wantErr {
			t.Errorf("ValidatePasswordStrength(%q) error = %v, wantErr %v", tt.password, err, tt.wantErr)
		}
	}
}
