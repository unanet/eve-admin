package main

import (
	"net/http"

	"github.com/unanet/eve-admin/internal/manager"

	"github.com/unanet/eve-admin/internal/api"
	"github.com/unanet/eve-admin/internal/config"
	"github.com/unanet/eve-admin/internal/handler"
	evehttp "github.com/unanet/go/pkg/http"
	"github.com/unanet/go/pkg/identity"
	"github.com/unanet/go/pkg/log"
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

	// Create and Start the app (listen for requests)
	api.NewApi(controllers, cfg, mgr).Start()
}

// This is required for the HTTP Client Request/Response Logging
// Not sure why, but setting explicitly only works in the parent eve project
// when importing the mod from other repos, this needs to be handled via init process
func init() {
	http.DefaultTransport = evehttp.LoggingTransport
}
