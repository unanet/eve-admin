package main

import (
	"net/http"

	"gitlab.unanet.io/devops/cloud-admin/internal/api"
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/cloud-admin/internal/handler"
	evehttp "gitlab.unanet.io/devops/go/pkg/http"
	"gitlab.unanet.io/devops/go/pkg/log"
	"gitlab.unanet.io/devops/go/pkg/oidcprovider"
	"go.uber.org/zap"
)

func main() {
	cfg := config.Load()

	oidcSvc, err := oidcprovider.NewService(cfg.OpenID)
	if err != nil {
		log.Logger.Panic("Unable to Initialize the OIDC Service Provider", zap.Error(err))
	}

	controllers, err := handler.InitializeControllers(cfg, oidcSvc)
	if err != nil {
		log.Logger.Panic("Unable to Initialize the Controllers", zap.Error(err))
	}

	app, err := api.NewApi(controllers, cfg)
	if err != nil {
		log.Logger.Panic("Failed to Create Cloud-Admind API", zap.Error(err))
	}

	app.Start()
}

// This is required for the HTTP Client Request/Response Logging
// Not sure why, but setting explicitly only works in the parent eve project
// when importing the mod from other repos, this needs to be handled via init process
func init() {
	http.DefaultTransport = evehttp.LoggingTransport
}
