package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	c "sozonov.tech/sv/src/Context"
	dto "sozonov.tech/sv/src/DTO"

	_ "github.com/lib/pq"

	"github.com/gorilla/mux"
)

func GetSnippets(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	pathVars := mux.Vars(req)
	langId1, err1 := strconv.Atoi(pathVars["langId1"])
	langId2, err2 := strconv.Atoi(pathVars["langId2"])
	taskId, err3 := strconv.Atoi(pathVars["taskGroupId"])
	if err1 != nil || err2 != nil || err3 != nil {
		return
	}

	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.Snippet, langId1, langId2, taskId)
	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()

	var snippets []dto.SnippetDTO
	for rows.Next() {
		var snippet dto.SnippetDTO
		if err := rows.Scan(&snippet.LeftId, &snippet.LeftCode, &snippet.TaskId, &snippet.TaskName,
			&snippet.RightId, &snippet.RightCode); err != nil {
			return
		}
		snippets = append(snippets, snippet)
	}
	json.NewEncoder(w).Encode(snippets)
}

func GetLanguages(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.Language)
	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()

	var results []dto.LanguageDTO
	for rows.Next() {
		var rw dto.LanguageDTO
		if err := rows.Scan(&rw.Id, &rw.Name, &rw.LanguageGroup); err != nil {
			return
		}
		results = append(results, rw)
	}
	json.NewEncoder(w).Encode(results)
}

func GetTaskGroups(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.TaskGroup)
	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()

	var results []dto.TaskGroupDTO
	for rows.Next() {
		var rw dto.TaskGroupDTO
		if err := rows.Scan(&rw.Id, &rw.Name); err != nil {
			return
		}
		results = append(results, rw)
	}
	json.NewEncoder(w).Encode(results)
}

func GetTasks(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	taskGroupId, err1 := strconv.Atoi(mux.Vars(req)["taskGroupId"])
	if err1 != nil {
		return
	}
	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.Task, taskGroupId)
	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()

	var results []dto.TaskDTO
	for rows.Next() {
		var rw dto.TaskDTO
		if err := rows.Scan(&rw.Id, &rw.Name, &rw.Description); err != nil {
			return
		}
		results = append(results, rw)
	}
	json.NewEncoder(w).Encode(results)
}

func GetAlternatives(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	taskLanguageId, err1 := strconv.Atoi(mux.Vars(req)["taskLanguageId"])
	if err1 != nil {
		return
	}
	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.Task, taskLanguageId)
	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()

	var results []dto.AlternativeDTO
	for rows.Next() {
		var rw dto.AlternativeDTO
		if err := rows.Scan(&rw.PrimaryId, &rw.PrimaryScore, &rw.PrimaryScore, &rw.AlternativeId,
			&rw.AlternativeCode, &rw.AlternativeScore, &rw.TSUpload); err != nil {
			return
		}
		results = append(results, rw)
	}
	json.NewEncoder(w).Encode(results)
}

func GetProposals(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.Proposal)
	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()

	var results []dto.ProposalDTO
	for rows.Next() {
		var rw dto.ProposalDTO
		if err := rows.Scan(&rw.LangageName, &rw.TaskName, &rw.ProposalId, &rw.ProposalCode, &rw.TSUpload); err != nil {
			return
		}
		results = append(results, rw)
	}
	json.NewEncoder(w).Encode(results)
}

func GetComments(ctx *c.Context, w http.ResponseWriter, req *http.Request) {
	snippetId, err1 := strconv.Atoi(mux.Vars(req)["snippetId"])
	if err1 != nil {
		return
	}

	rows, err := ctx.CONN.Query(ctx.GET_QUERIES.Comment, snippetId)
	if err != nil {
		fmt.Fprintf(os.Stdout, err.Error())
		return
	}
	defer rows.Close()
	var results []dto.CommentDTO
	for rows.Next() {
		var rw dto.CommentDTO
		if err := rows.Scan(&rw.Content, &rw.TStamp, &rw.Id, &rw.Author); err != nil {
			return
		}
		results = append(results, rw)
	}
	json.NewEncoder(w).Encode(results)
}
