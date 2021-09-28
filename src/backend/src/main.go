package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq"
	c "sozonov.tech/sv/src/Context"
	dbaccess "sozonov.tech/sv/src/DBAccess"
	"sozonov.tech/sv/src/api"

	"github.com/gorilla/mux"
)

func makeContext() (*c.Context, string) {
	connPool, err := sql.Open("postgres", dbaccess.CONN_STRING)
	//connPool.Exec(`set search_path='mySchema'`)
	//defer conn.Close()

	result := c.Context{
		GET_QUERIES:  dbaccess.MakeGetQueries(),
		POST_QUERIES: dbaccess.MakePostQueries(),
		CONN:         connPool,
	}
	if err == nil {
		return &result, ""
	}
	return &result, err.Error()
}

func makeRouter(ctx *c.Context) *mux.Router {
	router := mux.NewRouter()

	subrouter := router.PathPrefix("/api/v1").Subrouter()
	subrouter.HandleFunc("/snippet/get/{langId1:[0-9]+}/{langId2:[0-9]+}/{taskGroupId:[0-9]+}", c.Contextualize(api.GetSnippets, ctx)).Methods("GET")
	subrouter.HandleFunc("/language/get", c.Contextualize(api.GetLanguages, ctx)).Methods("GET")
	subrouter.HandleFunc("/taskGroup/get", c.Contextualize(api.GetTaskGroups, ctx)).Methods("GET")
	subrouter.HandleFunc("/task/get/{taskGroupId:[0-9]+}", c.Contextualize(api.GetTasks, ctx)).Methods("GET")
	subrouter.HandleFunc("/snippet/alternative/get/{taskLanguageId:[0-9]+}", c.Contextualize(api.GetAlternatives, ctx)).Methods("GET")
	subrouter.HandleFunc("/snippet/proposal/get", c.Contextualize(api.GetProposals, ctx)).Methods("GET")
	subrouter.HandleFunc("/comment/get/{snippetId:[0-9]+}", c.Contextualize(api.GetComments, ctx)).Methods("GET")

	spa := api.SpaHandler{StaticPath: "build", IndexPath: "index.html"}
	router.PathPrefix("/").Handler(spa).Methods("GET")
	return router
}

func main() {
	context, errMsg := makeContext()
	if errMsg != "" {
		log.Fatal(errMsg)
	}
	router := makeRouter(context)

	srv := &http.Server{
		Handler:      router,
		Addr:         "127.0.0.1:40100",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}
