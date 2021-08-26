package handler

import (
	"github.com/unanet/eve-admin/internal/config"
	"github.com/unanet/eve-admin/internal/manager"
)

func InitializeControllers(config config.Config, mgr *manager.Service) ([]Controller, error) {

	return []Controller{
		NewPingController(),
		NewRootController(),
		NewAuthController(mgr),

		NewEveController(config),

		NewAPIProxyController(config),
	}, nil
}
