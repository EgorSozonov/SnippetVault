package dbaccess

type PostQueries struct {
	UpdateSnippet        string
	InsertSnippet        string
	ApproveSnippet       string
	DeleteSnippet        string
	ChangePrimarySnippet string
	Vote                 string

	UpdateLanguage      string
	InsertLanguage      string
	InsertLanguageGroup string

	UpdateTaskGroup string
	InsertTaskGroup string
	UpdateTask      string
	InsertTask      string
	UpdateComment   string
	InsertComment   string
	DeleteComment   string
}

func MakePostQueries() PostQueries {
	return PostQueries{
		UpdateSnippet: ``,
		InsertSnippet: `INSERT INTO snippet.snippet("taskLanguageId", content, "isApproved", score)
						VALUES (?, ?, 0, 0);`,
		ApproveSnippet: `UPDATE snippet.snippet
						SET "isApproved"=1::bit 
						WHERE id=?;`,
		DeleteSnippet: `DELETE FROM snippet.snippet 
						WHERE id=?;`,
		ChangePrimarySnippet: `UPDATE snippet."taskLanguage"
								SET "primarySnippetId"=? WHERE id=?;`,

		Vote: `INSERT INTO snippet."userVote"("userId", "taskLanguageId", "snippetId")
				VALUES (?, ?, ?) 
				ON CONFLICT("userId", "taskLanguageId") 
					DO UPDATE SET "snippetId"=EXCLUDED."snippetId";

				UPDATE snippet.snippet 
				SET score=score-1 WHERE id=?;

				UPDATE snippet.snippet 
				SET score=score+1 WHERE id=?;`,
		UpdateLanguage:      ``,
		InsertLanguage:      `INSERT INTO snippet.language(code, name, "isDeleted", "languageGroupId") VALUES (?, ?, 0::bit, ?);`,
		InsertLanguageGroup: `INSERT INTO snippet."languageGroup"(code, name) VALUES (?, ?);`,
		UpdateTaskGroup:     ``,
		InsertTaskGroup:     `INSERT INTO snippet."taskGroup"(name, "isDeleted") VALUES (?, 0::bit);`,
		UpdateTask:          ``,
		InsertTask:          `INSERT INTO snippet.task(name, "taskGroupId") VALUES (?, ?);`,

		UpdateComment: ``,
		InsertComment: `INSERT INTO snippet.comment("userId", "snippetId", content, "dateComment")
						VALUES (?, ?, ?, ?);`,
		DeleteComment: `DELETE FROM snippet.comment 
						WHERE id=?;`,
	}
}
