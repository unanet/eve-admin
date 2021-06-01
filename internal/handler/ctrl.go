package handler

import (
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/cloud-admin/internal/manager"
)

func InitializeControllers(config config.Config, mgr *manager.Service) ([]Controller, error) {

	return []Controller{
		NewPingController(),
		NewRootController(),
		NewAuthController(mgr),

		NewDashboardController(config),
		NewAPIProxyController(config),

	}, nil
}
