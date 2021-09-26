package dto

import (
	"time"
)

type ProposalDTO struct {
	ProposalId   string
	ProposalCode string
	TaskName     string
	LangageName  string
	TSUpload     time.Time
}
