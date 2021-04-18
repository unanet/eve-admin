package main

import (
	"gitlab.unanet.io/devops/cloud-admin/internal/manager"
	"net/http"

	"gitlab.unanet.io/devops/cloud-admin/internal/api"
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/cloud-admin/internal/handler"
	evehttp "gitlab.unanet.io/devops/go/pkg/http"
	"gitlab.unanet.io/devops/go/pkg/identity"
	"gitlab.unanet.io/devops/go/pkg/log"
	"go.uber.org/zap"
)

func main() {
	cfg := config.Load()

	// Create the Service Deps here
	idSvc, err := identity.NewService(cfg.Identity)
	if err != nil {
		log.Logger.Panic("Unable to Initialize the Identity Service Provider", zap.Error(err))
	}

	// Create the Service Manager here
	// ...wire up the deps and pass the manager to the Controller Init
	mgr := manager.NewService(
		&cfg,
		manager.OpenIDConnectOpt(idSvc),
	)

	// Initialize the controllers
	controllers, err := handler.InitializeControllers(cfg, mgr)
	if err != nil {
		log.Logger.Panic("Unable to Initialize the Controllers", zap.Error(err))
	}

	// Create the App (API Server/Listener)
	app, err := api.NewApi(controllers, cfg, mgr)
	if err != nil {
		log.Logger.Panic("Failed to Create Cloud-Admind API", zap.Error(err))
	}

	// Start the app (listen for requests)
	app.Start()
}

// This is required for the HTTP Client Request/Response Logging
// Not sure why, but setting explicitly only works in the parent eve project
// when importing the mod from other repos, this needs to be handled via init process
func init() {
	http.DefaultTransport = evehttp.LoggingTransport
}
