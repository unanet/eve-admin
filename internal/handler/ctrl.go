package handler

import (
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/go/pkg/oidcprovider"
)

func InitializeControllers(config config.Config, oidc *oidcprovider.Service) ([]Controller, error) {

	return []Controller{
		NewPingController(),
		NewRootController(),
		NewAuthController(oidc),
	}, nil
}
