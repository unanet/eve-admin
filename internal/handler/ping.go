package handler

import (
	"net/http"

	"github.com/go-chi/render"
)

type PingController struct {
}

func NewPingController() *PingController {
	return &PingController{}
}

func (c PingController) Setup(r *Routers) {
	r.Anonymous.Get("/ping", c.ping)
}

func (c PingController) ping(w http.ResponseWriter, r *http.Request) {
	render.Respond(w, r, render.M{
		"message": "pong",
		"version": Version,
	})
}
