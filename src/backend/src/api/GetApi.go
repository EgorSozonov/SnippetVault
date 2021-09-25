package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	c "sozonov.tech/sv/src/Context"

	_ "github.com/lib/pq"

	"github.com/gorilla/mux"
)

type SnippetDTO struct {
	LeftId    sql.NullInt64
	LeftCode  sql.NullString
	TaskId    int
	TaskName  string
	RightId   sql.NullInt64
	RightCode sql.NullString
}

func HwHandlerParam(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	//w.WriteHeader(http.StatusOK)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		id = 0
	}

	fmt.Fprintf(os.Stdout, "%d\n", id)

	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.Snippet)
	fmt.Fprintf(os.Stdout, "Query was run\n")

	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()

	var snippets []SnippetDTO
	rowCounter := 1
	for rows.Next() {
		fmt.Printf("Scanning row %d\n", rowCounter)
		var snippet SnippetDTO
		if err := rows.Scan(&snippet.LeftId, &snippet.LeftCode, &snippet.TaskId, &snippet.TaskName,
			&snippet.RightId, &snippet.RightCode); err != nil {
			fmt.Fprintf(os.Stdout, err.Error())
			return
		}
		fmt.Printf("Scanned row %d\n", rowCounter)
		rowCounter += 1
		snippets = append(snippets, snippet)
	}
	json.NewEncoder(w).Encode(snippets)

}

func GetLanguages(connPool *sql.DB, w http.ResponseWriter, req *http.Request) {
	// 	SELECT l.code, l.name, lg.name AS "languageGroup" FROM snippet.language l
	// JOIN snippet."languageGroup" lg ON l."languageGroupId"=lg.id;

}

func GetTaskGroups(connPool *sql.DB, w http.ResponseWriter, req *http.Request) {
}

func GetTasks(connPool *sql.DB, w http.ResponseWriter, req *http.Request) {
}

func GetAlternatives(connPool *sql.DB, w http.ResponseWriter, req *http.Request) {
}

func GetProposals(connPool *sql.DB, w http.ResponseWriter, req *http.Request) {
}

func GetComments(connPool *sql.DB, w http.ResponseWriter, req *http.Request) {
}
