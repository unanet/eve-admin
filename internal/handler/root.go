package handler

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi"
)

// RootController is the Controller/Handler for base root
type RootController struct {
}

// NewRootController creates a new root controller which serves the static site
func NewRootController() *RootController {
	return &RootController{}
}

// Setup satisfies the EveController interface for setting up the
func (c RootController) Setup(r *Routers) {
	workDir, _ := os.Getwd()
	path := "./client/dist" //"dist"
	filesDir := http.Dir(filepath.Join(workDir, path))
	FileServer(r.Anonymous, "/", filesDir)
}

// FileServer conveniently sets up a http.FileServer handler to serve
// static files from a http.FileSystem.
func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}


	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.RequestURI, "/admin") || strings.HasPrefix(r.RequestURI, "/oidc"){
			r.RequestURI = "/"
			r.URL.Path = "/"
		}

		http.FileServer(root).ServeHTTP(w, r)
		//
		//rctx := chi.RouteContext(r.Context())
		//pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		//fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		//fs.ServeHTTP(w, r)
	})
}
