package api

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

func hwHandlerPost(w http.ResponseWriter, req *http.Request) {
	io.WriteString(w, "Hello, world!\n")
	vars := mux.Vars(req)
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Category: %v\n", vars["category"])
}
