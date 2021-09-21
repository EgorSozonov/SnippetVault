package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type foo struct {
	X int
	Y string
	Z bool
}

func HwHandlerParam(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	//w.WriteHeader(http.StatusOK)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		id = 0
	}
	res := foo{id, "hw", true}
	fmt.Printf("i = %d", id)
	if err != nil {
		fmt.Fprintf(w, "Error encoding the JSON")
	} else {
		json.NewEncoder(w).Encode(res)
	}

}
