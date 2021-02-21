package api

import (
	"github.com/go-chi/chi"
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
)

type Controller interface {
	Setup(chi.Router)
}

// InitController initializes the controller (handlers)
func InitController(cfg *config.Config) []Controller {
	return []Controller{
		NewPingController(),
		NewRootController(),
	}
}
