package handler

import "github.com/go-chi/chi"

var (
	Version = "unset"
)

type Routers struct {
	Auth      chi.Router
	Anonymous chi.Router
}

type Controller interface {
	Setup(*Routers)
}
