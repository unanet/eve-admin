package config

import (
	"sync"

	"github.com/kelseyhightower/envconfig"
	"gitlab.unanet.io/devops/go/pkg/identity"
	"gitlab.unanet.io/devops/go/pkg/log"
	"go.uber.org/zap"
)

var (
	cfg   *Config
	mutex = sync.Mutex{}
)

type (
	// LogConfig is the logger config (log level, output...)
	LogConfig = log.Config

	// IdentityConfig is the OpenID Connect Provider Configuration (i.e. Keycloak)
	IdentityConfig = identity.Config
)

// Config is the top level application config
// CLOUD_IDENTITY_CONN_URL
// CLOUD_IDENTITY_CLIENT_ID
// CLOUD_IDENTITY_CLIENT_SECRET
// CLOUD_IDENTITY_REDIRECT_URL
type Config struct {
	LogConfig
	Identity                      IdentityConfig
	ReadOnly                      bool   `split_words:"true" default:"true"`
	Port                          int    `split_words:"true" default:"8080"`
	MetricsPort                   int    `split_words:"true" default:"3001"`
	ServiceName                   string `split_words:"true" default:"cloud-admin"`
	RouteMount                    string `split_words:"true" default:"admin"`
	EveAPIUrl                     string `split_words:"true" default:"https://eve-api.unanet.io"`
	DashboardCacheDurationSeconds int    `split_words:"true" default:"15"`
}

// Load loads the config reading it from the environment
func Load() Config {
	mutex.Lock()
	defer mutex.Unlock()
	if cfg != nil {
		return *cfg
	}
	c := Config{}
	err := envconfig.Process("CLOUD", &c)
	if err != nil {
		log.Logger.Panic("Unable to Load Config", zap.Error(err))
	}

	cfg = &c

	cfg.DashboardCacheDurationSeconds = cfg.DashboardCacheDurationSeconds * 1000 * 1000 * 1000 // Convert NS to seconds
	return *cfg
}
