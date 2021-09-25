package context

import (
	"database/sql"
	"net/http"

	dbaccess "sozonov.tech/sv/src/DBAccess"
)

type Context struct {
	GET_QUERIES  dbaccess.GetQueries
	POST_QUERIES dbaccess.PostQueries
	CONN         *sql.DB
}

func ContextualizeHandler(f func(c *Context, w http.ResponseWriter, req *http.Request), c *Context) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) {
		f(c, w, req)
	}
}
