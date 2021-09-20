package main

import (
	"io"
	"log"
	"net/http"
	"time"

	"sozonov.tech/sv/src/api"

	"github.com/gorilla/mux"
)

func hwHandler(w http.ResponseWriter, req *http.Request) {
	io.WriteString(w, "Hello, world!\n")
}

func zzHandler(w http.ResponseWriter, req *http.Request) {
	io.WriteString(w, "Hello, zzz!\n")
}

func rootHandler(w http.ResponseWriter, req *http.Request) {
	io.WriteString(w, "Hello, root!\n")
}

func main() {
	router := mux.NewRouter()

	subrouter := router.PathPrefix("/api/v1").Subrouter()

	subrouter.HandleFunc("/hw/{id:[0-9]+}", api.HwHandlerParam).Methods("GET")
	subrouter.HandleFunc("/ww", hwHandler).Methods("GET")
	subrouter.HandleFunc("/zzz", zzHandler).Methods("GET")

	spa := api.SpaHandler{StaticPath: "build", IndexPath: "index.html"}
	router.PathPrefix("/").Handler(spa).Methods("GET")

	srv := &http.Server{
		Handler:      router,
		Addr:         "127.0.0.1:40100",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
