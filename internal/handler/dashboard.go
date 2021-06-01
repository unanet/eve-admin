package handler

import (
	"encoding/json"
	"fmt"
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/cloud-admin/internal/models"
	"gitlab.unanet.io/devops/go/pkg/errors"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/go-chi/render"
)

type dashboardCache struct {
	nextFetchTime time.Time
	data      []models.DashboardMetricsEntry
}

type DashboardController struct {
	cacheDuration time.Duration
	//metricsCache  dashboardCache // This is before a long weekend and putting this in file below in a non thread safe way might be the way to go
	cfg           config.Config
}

// Purposely non thread safe statement
var _dashboardMetricsCache dashboardCache

func NewDashboardController(cfg config.Config) *DashboardController {
	return &DashboardController{
		cacheDuration: time.Duration(cfg.DashboardCacheDurationSeconds),
		cfg:           cfg,
	}
}

func (c DashboardController) Setup(r *Routers) {
	r.Auth.Get("/eve/dashboard/metrics", c.dashboardMetrics)
}

func (c DashboardController) stripAPIPrefix(pathToStrip string, url *url.URL) *url.URL {
	// TODO circle back and clean this up to a better way
	url.Path = strings.Replace(url.Path, "/api/eve", "", -1)
	return url
}

func (c DashboardController) dashboardMetrics(w http.ResponseWriter, r *http.Request) {

	if time.Now().Before(_dashboardMetricsCache.nextFetchTime) {
		render.Status(r, http.StatusOK)
		render.Respond(w, r,_dashboardMetricsCache.data)
		return
	}

	var errs []error
	var dashboardMetrics []models.DashboardMetricsEntry

	types := []string{
		"artifacts",
		"clusters",
		"environments",
		"feeds",
		"metadata",
		"namespaces",
		"services",
		"jobs",
	}

	for _, name := range types {
		itemArray, err := c.makeRequest("/" + strings.ToLower(name))
		if err != nil {
			errs = append(errs, err)
			return
		}

		dashboardMetrics = append(dashboardMetrics, models.DashboardMetricsEntry{
			Label: name,
			Count: len(itemArray),
		})
	}

	if len(errs) > 0 {
		render.Status(r, http.StatusInternalServerError)
		render.Respond(w, r, errs)
		return
	}

	// Cache our data for later
	_dashboardMetricsCache.nextFetchTime = time.Now().Add(c.cacheDuration)
	_dashboardMetricsCache.data = dashboardMetrics

	render.Status(r, http.StatusOK)
	render.Respond(w, r, dashboardMetrics)
}

// We can update this method to accept an enum or something to determine which api to go to and what to strip off
func (c DashboardController) makeRequest(path string) ([]interface{}, error) {

	resp, err := http.Get(fmt.Sprintf("%s%s", c.cfg.EveAPIUrl, path))
	if err != nil {
		return nil, errors.Wrap(err)
	}

	var jsonBody []interface{}

	// Ignore error if it happens here, delete won't return anything
	if err = json.NewDecoder(resp.Body).Decode(&jsonBody); err != nil {
		return nil, errors.Wrap(err)
	}

	return jsonBody, nil
}
