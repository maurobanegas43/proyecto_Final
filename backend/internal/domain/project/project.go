// Package project contains the core domain model for real-estate projects.
// It must not import any framework, driver or infrastructure package.
package project

import (
	"errors"
	"strings"
	"time"
)

// Status represents the lifecycle state of a project.
type Status string

const (
	StatusDraft       Status = "draft"
	StatusUnderReview Status = "under_review"
	StatusApproved    Status = "approved"
	StatusRejected    Status = "rejected"
	StatusPublished   Status = "published"
)

var (
	ErrInvalidName       = errors.New("project name is required")
	ErrInvalidGoal       = errors.New("funding goal must be greater than zero")
	ErrInvalidTransition = errors.New("invalid status transition")
	ErrNotFound          = errors.New("project not found")
)

// allowedTransitions encodes the review workflow invariants.
var allowedTransitions = map[Status][]Status{
	StatusDraft:       {StatusUnderReview},
	StatusUnderReview: {StatusApproved, StatusRejected},
	StatusRejected:    {StatusDraft},
	StatusApproved:    {StatusPublished},
	StatusPublished:   {},
}

// Money is expressed in minor units (cents) to avoid floating point errors.
type Money int64

// Project is the aggregate root for a real-estate development.
type Project struct {
	ID           string
	DeveloperID  string
	Name         string
	Location     string
	Description  string
	FundingGoal  Money
	FundsRaised  Money
	Progress     int // declared construction progress, 0..100
	Status       Status
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// New creates a project in draft state after validating invariants.
func New(id, developerID, name, location, description string, goal Money, now time.Time) (*Project, error) {
	if strings.TrimSpace(name) == "" {
		return nil, ErrInvalidName
	}
	if goal <= 0 {
		return nil, ErrInvalidGoal
	}
	return &Project{
		ID:          id,
		DeveloperID: developerID,
		Name:        strings.TrimSpace(name),
		Location:    location,
		Description: description,
		FundingGoal: goal,
		Status:      StatusDraft,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

// TransitionTo moves the project to a new status if the workflow allows it.
func (p *Project) TransitionTo(next Status, now time.Time) error {
	for _, s := range allowedTransitions[p.Status] {
		if s == next {
			p.Status = next
			p.UpdatedAt = now
			return nil
		}
	}
	return ErrInvalidTransition
}

// FundedPercent returns the funding completion as an integer percentage.
func (p *Project) FundedPercent() int {
	if p.FundingGoal == 0 {
		return 0
	}
	return int(p.FundsRaised * 100 / p.FundingGoal)
}
