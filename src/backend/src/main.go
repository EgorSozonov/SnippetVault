package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq"
	dbaccess "sozonov.tech/sv/src/DBAccess"
	"sozonov.tech/sv/src/api"

	"github.com/gorilla/mux"
)

func makeContext() (*Context, string) {
	connPool, err := sql.Open("postgres", dbaccess.CONN_STRING)
	//connPool.Exec(`set search_path='mySchema'`)
	//defer conn.Close()

	result := Context{
		GET_QUERIES:  dbaccess.MakeGetQueries(),
		POST_QUERIES: dbaccess.MakePostQueries(),
		CONN:         connPool,
	}
	if err == nil {
		return &result, ""
	}
	return &result, err.Error()
}

func makeRouter(ctx *Context) *mux.Router {
	router := mux.NewRouter()

	subrouter := router.PathPrefix("/api/v1").Subrouter()

	subrouter.HandleFunc("/hw/{id:[0-9]+}", contextualizeHandler(api.HwHandlerParam, ctx)).Methods("GET")

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
