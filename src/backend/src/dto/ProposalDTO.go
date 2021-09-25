package dto

import (
	"database/sql"
	"time"
)

type ProposalDTO struct {
	leftCode     sql.NullString
	taskId       int
	taskName     string
	proposalCode string
	langId       int
	date         time.Time
}
