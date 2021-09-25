package dto

import (
	"database/sql"
)

type SnippetDTO struct {
	LeftId    sql.NullInt64
	LeftCode  sql.NullString
	TaskId    int
	TaskName  string
	RightId   sql.NullInt64
	RightCode sql.NullString
}
