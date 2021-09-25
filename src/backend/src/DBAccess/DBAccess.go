package dbaccess

import (
	"database/sql"
	"net/http"

	_ "github.com/lib/pq"
)

func DBPoolClosure(db *sql.DB, f func(db *sql.DB, w http.ResponseWriter, req *http.Request)) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) {
		f(db, w, req)
	}
}
