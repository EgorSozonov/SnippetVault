package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	dbaccess "sozonov.tech/sv/src/DBAccess"

	"github.com/gorilla/mux"
)

type foo struct {
	X int
	Y string
	Z bool
}

type SnippetDTO struct {
	LeftId    int
	LeftCode  string
	TaskId    int
	TaskName  string
	RightId   int
	RightCode string
}

func HwHandlerParam(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	//w.WriteHeader(http.StatusOK)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		id = 0
	}
	fmt.Fprintf(os.Stdout, "About to open connection\n")
	connPool, err := sql.Open("postgres", dbaccess.CONN_STRING)

	//defer conn.Close()
	if err == nil {
		//conn.Exec(`set search_path='mySchema'`)
		fmt.Fprintf(os.Stdout, "Connection was opened\n")
		fmt.Fprintf(os.Stdout, "About to run query\n")
		rows, err := connPool.Query(`
			SELECT sn1.id as "leftId", sn1.content as "leftCode", t.id AS "taskId", t.name AS "taskName", 
			sn2.id AS "rightId", sn2.content AS "rightCode"
			FROM snippet."task" AS t
			LEFT JOIN snippet."taskLanguage" tl1 ON tl1."taskId"=t.id AND tl1."languageId"=0
			LEFT JOIN snippet."taskLanguage" tl2 ON tl2."taskId"=t.id AND tl2."languageId"=11
			JOIN snippet.language l1 ON l1.id=tl1."languageId"
			JOIN snippet.language l2 ON l2.id=tl2."languageId"
			LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1."primarySnippetId"
			LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2."primarySnippetId"
			WHERE t."taskGroupId"=3;`)
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
				return
			}
			fmt.Printf("Scanned row %d\n", rowCounter)
			rowCounter += 1
			snippets = append(snippets, snippet)
		}
		json.NewEncoder(w).Encode(snippets)
	} else {
		res := foo{id, "no DB", true}
		json.NewEncoder(w).Encode(res)
		// if err != nil {
		// 	fmt.Fprintf(w, "Error encoding the JSON")
		// } else {
		// 	json.NewEncoder(w).Encode(res)
		// }
	}

}
