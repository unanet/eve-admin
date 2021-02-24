package api

import (
	"context"
	"fmt"
	"gitlab.unanet.io/devops/cloud-admin/internal/manager"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"go.uber.org/zap"

	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/cloud-admin/internal/handler"
	"gitlab.unanet.io/devops/go/pkg/log"
	"gitlab.unanet.io/devops/go/pkg/metrics"
	"gitlab.unanet.io/devops/go/pkg/middleware"
)

var (
	Version = "unset"
)

type Api struct {
	r           chi.Router
	controllers []handler.Controller
	server      *http.Server
	mServer     *http.Server
	done        chan bool
	sigChannel  chan os.Signal
	onShutdown  []func()
	config      config.Config
	mgr         *manager.Service
}

func NewApi(controllers []handler.Controller, c config.Config, mgr *manager.Service) (*Api, error) {
	router := chi.NewMux()
	return &Api{
		r:           router,
		config:      c,
		controllers: controllers,
		server: &http.Server{
			ReadTimeout:  time.Duration(5) * time.Second,
			WriteTimeout: time.Duration(30) * time.Second,
			IdleTimeout:  time.Duration(90) * time.Second,
			Addr:         fmt.Sprintf(":%d", c.Port),
			Handler:      router,
		},
		done:       make(chan bool),
		sigChannel: make(chan os.Signal, 1024),
		mgr:        mgr,
	}, nil
}

// Handle SIGNALS
func (a *Api) sigHandler() {
	for {
		sig := <-a.sigChannel
		switch sig {
		case syscall.SIGHUP:
			log.Logger.Warn("SIGHUP hit, Nothing supports this currently")
		case os.Interrupt, syscall.SIGTERM, syscall.SIGINT:
			log.Logger.Info("Caught Shutdown Signal", zap.String("signal", sig.String()))
			a.gracefulShutdown()
		}
	}
}

func (a *Api) gracefulShutdown() {
	// Pause the Context for `ShutdownTimeoutSecs` config value
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(300)*time.Second)
	defer cancel()

	// Turn off keepalive
	a.server.SetKeepAlivesEnabled(false)
	a.mServer.SetKeepAlivesEnabled(false)

	// Attempt to shutdown cleanly
	for _, x := range a.onShutdown {
		x()
	}
	if err := a.mServer.Shutdown(ctx); err != nil {
		panic("HTTP Metrics Server Failed Graceful Shutdown")
	}
	if err := a.server.Shutdown(ctx); err != nil {
		panic("HTTP API Server Failed Graceful Shutdown")
	}
	if err := log.Logger.Sync(); err != nil {
		// not much to do here
	}
	close(a.done)
}

// Start starts the Mux Service Listeners (API/Metrics)
func (a *Api) Start(onShutdown ...func()) {
	a.setup()
	a.onShutdown = onShutdown
	a.mServer = metrics.StartMetricsServer(a.config.MetricsPort)

	signal.Notify(a.sigChannel, os.Interrupt, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM)
	go a.sigHandler()
	log.Logger.Info("API Listener", zap.Int("port", a.config.Port))
	if err := a.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Logger.Panic("Failed to Start Server", zap.Error(err))
	}

	<-a.done
	log.Logger.Info("Service Shutdown")
}

func (a *Api) setup() {
	middleware.SetupMiddleware(a.r, 60*time.Second)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	a.r.Use(c.Handler)

	authenticated := a.r.Group(nil)
	authenticated.Use(a.mgr.AuthenticationMiddleware())

	for _, c := range a.controllers {
		c.Setup(&handler.Routers{
			Auth:      authenticated,
			Anonymous: a.r,
		})
	}
}
