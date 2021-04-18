package config

import (
	"github.com/kelseyhightower/envconfig"
	"gitlab.unanet.io/devops/go/pkg/identity"
	"gitlab.unanet.io/devops/go/pkg/log"
	"go.uber.org/zap"
	"sync"
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
type Config struct {
	LogConfig
	Identity    IdentityConfig
	Port        int    `split_words:"true" default:"8080"`
	MetricsPort int    `split_words:"true" default:"3001"`
	ServiceName string `split_words:"true" default:"cloud-admin"`
	RouteMount  string `split_words:"true" default:"admin"`
}

// Load loads the config reading it from the environment
func Load() Config {
	mutex.Lock()
	defer mutex.Unlock()
	if cfg != nil {
		return *cfg
	}
	c := Config{}
	err := envconfig.Process("", &c)
	if err != nil {
		log.Logger.Panic("Unable to Load Config", zap.Error(err))
	}
	cfg = &c
	return *cfg
}
