package dto

import (
	"time"
)

type AlternativeDTO struct {
	PrimaryId        string
	PrimaryCode      string
	PrimaryScore     int
	AlternativeId    int
	AlternativeCode  string
	AlternativeScore int
	TSUpload         time.Time
}
