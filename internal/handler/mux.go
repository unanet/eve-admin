package handler

import "github.com/go-chi/chi"

var (
	Version = "unset"
)

type Routers struct {
	Anonymous chi.Router
}

type Controller interface {
	Setup(*Routers)
}
