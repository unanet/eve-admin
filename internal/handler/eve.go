package handler

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/cloud-admin/internal/models"
	"gitlab.unanet.io/devops/go/pkg/errors"
	"gitlab.unanet.io/devops/go/pkg/middleware"
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

type EveController struct {
	cacheDuration time.Duration
	//metricsCache  dashboardCache // This is before a long weekend and putting this in file below in a non thread safe way might be the way to go
	cfg           config.Config
}

// Purposely non thread safe statement
var _dashboardMetricsCache dashboardCache

func NewEveController(cfg config.Config) *EveController {
	return &EveController{
		cacheDuration: time.Duration(cfg.DashboardCacheDurationSeconds),
		cfg:           cfg,
	}
}

func (c EveController) Setup(r *Routers) {
	r.Auth.Get("/eve/dashboard/metrics", c.dashboardMetrics)
	r.Auth.Get("/eve/services/{id}/metadata-maps", c.getServiceMetadataLayers)
	r.Auth.Get("/eve/services/{id}/definition-maps", c.getServiceDefinitionLayers)
	r.Auth.Get("/eve/jobs/{id}/metadata-maps", c.getJobMetadataLayers)
}

func (c EveController) stripAPIPrefix(pathToStrip string, url *url.URL) *url.URL {
	// TODO circle back and clean this up to a better way
	url.Path = strings.Replace(url.Path, "/backend/eve", "", -1)
	return url
}

func (c EveController) dashboardMetrics(w http.ResponseWriter, r *http.Request) {

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
		var itemArray []interface{}

		if err := c.makeRequest("/" + strings.ToLower(name), &itemArray); err != nil {
			middleware.Log(r.Context()).Error(err.Error())
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

func (c EveController) getServiceMetadataLayers(w http.ResponseWriter, r *http.Request) {
	c.getLayers(w, r, "services", "metadata")
}

func (c EveController) getServiceDefinitionLayers(w http.ResponseWriter, r *http.Request) {
	c.getLayers(w, r, "services", "definition")
}

func (c EveController) getJobMetadataLayers(w http.ResponseWriter, r *http.Request) {
	c.getLayers(w, r, "jobs", "metadata")
}

func (c EveController) getLayers(w http.ResponseWriter, r *http.Request, modelType string, layerType string) {

	id := chi.URLParam(r, "id")

	isDefinition := layerType == "definition"

	// Used to pluralize definitions if needed
	addedString := ""
	if isDefinition {
		addedString = "s"
	}

	var layers []models.LayerMap
	if err := c.makeRequest(fmt.Sprintf("/%s/%s/%s-maps", modelType, id, layerType), &layers); err != nil {
		render.Respond(w, r, errors.NotFoundf("error getting maps"))
		return
	}

	var errs []error

	for i, layer := range layers {
		var id int
		if isDefinition {
			id = layer.DefinitionID
		} else {
			id = layer.MetadataID
		}

		var data interface{}
		if err := c.makeRequest(fmt.Sprintf("/%s%s/%d", layerType, addedString, id), &data); err != nil {
			middleware.Log(r.Context()).Error(err.Error())
			errs = append(errs, err)
			return
		}

		if isDefinition {
			layers[i].Definition = data

		} else {
			layers[i].Metadata = data
		}
	}

	if len(errs) > 0 {
		render.Status(r, http.StatusInternalServerError)
		render.Respond(w, r, errs)
		return
	}

	var endResult interface{}
	if err := c.makeRequest(fmt.Sprintf("/%s/%s/%s%s", modelType, id, layerType, addedString), &endResult); err != nil {
		render.Respond(w, r, errors.NotFoundf("error getting end result data"))
		return
	}

	response := models.LayerResponse{
		Layers: layers,
		EndResult: endResult,
	}

	render.Status(r, http.StatusOK)
	render.Respond(w, r, response)

}

// We can update this method to accept an enum or something to determine which api to go to and what to strip off
func (c EveController) makeRequest(path string, model interface{}) error {

	resp, err := http.Get(fmt.Sprintf("%s%s", c.cfg.EveAPIUrl, path))
	if err != nil {
		return errors.Wrap(err)
	}

	// Ignore error if it happens here, delete won't return anything
	if err = json.NewDecoder(resp.Body).Decode(&model); err != nil {
		return errors.Wrap(err)
	}

	return nil
}
