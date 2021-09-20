package api

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func HwHandlerParam(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	//w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Hello, world %v!\n", vars["id"])
}
