package project

import (
	"testing"
	"time"
)

func TestNewValidatesInvariants(t *testing.T) {
	now := time.Now()
	tests := []struct {
		name    string
		pName   string
		goal    Money
		wantErr error
	}{
		{"valid", "Torre Norte", 1000, nil},
		{"empty name", "  ", 1000, ErrInvalidName},
		{"zero goal", "Torre Norte", 0, ErrInvalidGoal},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := New("p1", "d1", tt.pName, "", "", tt.goal, now)
			if err != tt.wantErr {
				t.Fatalf("got %v, want %v", err, tt.wantErr)
			}
		})
	}
}

func TestTransitionWorkflow(t *testing.T) {
	now := time.Now()
	p, _ := New("p1", "d1", "Torre Norte", "", "", 1000, now)

	if err := p.TransitionTo(StatusPublished, now); err != ErrInvalidTransition {
		t.Fatalf("draft -> published must fail, got %v", err)
	}
	for _, s := range []Status{StatusUnderReview, StatusApproved, StatusPublished} {
		if err := p.TransitionTo(s, now); err != nil {
			t.Fatalf("transition to %s failed: %v", s, err)
		}
	}
}
