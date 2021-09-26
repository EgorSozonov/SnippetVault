package dto

import (
	"time"
)

type CommentDTO struct {
	Id      int
	Author  string
	TStamp  time.Time
	Content string
}
