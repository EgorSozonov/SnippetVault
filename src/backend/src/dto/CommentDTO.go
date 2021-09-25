package dto

import (
	"time"
)

type CommentDTO struct {
	id      int
	author  string
	tStamp  time.Time
	content string
}
