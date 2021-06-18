package handler

import (
	"encoding/json"
	"fmt"
	"gitlab.unanet.io/devops/go/pkg/mergemap"
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"

	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/cloud-admin/internal/models"
	"gitlab.unanet.io/devops/eve/pkg/eve"
	"gitlab.unanet.io/devops/go/pkg/errors"
	"gitlab.unanet.io/devops/go/pkg/middleware"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

type dashboardCache struct {
	nextFetchTime time.Time
	data          []models.DashboardMetricsEntry
}

type EveController struct {
	cacheDuration time.Duration
	//metricsCache  dashboardCache // This is before a long weekend and putting this in file below in a non thread safe way might be the way to go
	cfg config.Config
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

	// Service metadata routes might need to be renamed to take into account for the end metadata layer output rather than service specific
	r.Auth.Get("/eve/service/{id}/metadata-maps", c.getServiceMetadataLayers)
	r.Auth.Get("/eve/service/{id}/definition-maps", c.getServiceDefinitionLayers)
	r.Auth.Get("/eve/job/{id}/metadata-maps", c.getJobMetadataLayers)


	// These three functions can probably be leveraged in a different way / updated to be more consistent. Maybe this is just {model}/{id}/metadata
	r.Auth.Get("/eve/cluster/{id}/metadata-maps", c.getClusterMetadataLayers)
	r.Auth.Get("/eve/artifact/{id}/metadata-maps", c.getArtifactMetadataLayers)
	r.Auth.Get("/eve/namespace/{id}/metadata-maps", c.getNamespaceMetadataLayers)
}

func (c EveController) stripAPIPrefix(pathToStrip string, url *url.URL) *url.URL {
	// TODO circle back and clean this up to a better way
	url.Path = strings.Replace(url.Path, "/backend/eve", "", -1)
	return url
}

func (c EveController) dashboardMetrics(w http.ResponseWriter, r *http.Request) {

	if time.Now().Before(_dashboardMetricsCache.nextFetchTime) {
		render.Status(r, http.StatusOK)
		render.Respond(w, r, _dashboardMetricsCache.data)
		return
	}

	var errs []error
	var dashboardMetrics []models.DashboardMetricsEntry

	types := []models.DashboardMetricsEntryMetadata{
		{
			APILink: "artifacts",
			Name:    "Artifacts",
			Link:    "artifact",
			Icon:    "bag",
		},
		{
			APILink: "clusters",
			Name:    "Clusters",
			Link:    "cluster",
			Icon:    "bag",
		},
		{
			APILink: "environments",
			Name:    "Environments",
			Link:    "environment",
			Icon:    "bag",
		},
		{
			APILink: "feeds",
			Name:    "Feeds",
			Link:    "feed",
			Icon:    "bag",
		},
		{
			APILink: "metadata",
			Name:    "Metadata",
			Link:    "metadata",
			Icon:    "bag",
		},
		{
			APILink: "namespaces",
			Name:    "Namespaces",
			Link:    "namespace",
			Icon:    "bag",
		},
		{
			APILink: "services",
			Name:    "Services",
			Link:    "service",
			Icon:    "bag",
		},
		{
			APILink: "jobs",
			Name:    "Jobs",
			Link:    "job",
			Icon:    "bag",
		},
	}

	for i, metadata := range types {
		var itemArray []interface{}

		if err := c.makeRequest("/"+strings.ToLower(metadata.APILink), &itemArray); err != nil {
			middleware.Log(r.Context()).Error(err.Error())
			errs = append(errs, err)
			return
		}

		dashboardMetrics = append(dashboardMetrics, models.DashboardMetricsEntry{
			SortOrder: i,
			Count:     len(itemArray),
			Metadata:  metadata,
		})
	}

	if len(errs) > 0 {
		render.Status(r, http.StatusInternalServerError)
		render.Respond(w, r, errs)
		return
	}

	sort.SliceStable(dashboardMetrics, func(i, j int) bool {
		return dashboardMetrics[i].SortOrder < dashboardMetrics[j].SortOrder
	})

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

func (c EveController) getNamespaceMetadataLayers(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		render.Respond(w, r, errors.BadRequest("namespace id is not a number"))
		return
	}

	var baseModels []eve.Namespace
	if err := c.makeRequest(fmt.Sprintf("/namespaces"), &baseModels); err != nil {
		render.Respond(w, r, errors.NotFound("error getting namespaces"))
		return
	}

	var baseModel eve.Namespace

	for _, model := range baseModels {
		if model.ID == id {
			baseModel = model
		}
	}

	var metadataServiceMaps []eve.MetadataServiceMap
	if err := c.makeRequest(fmt.Sprintf("/metadata/service-maps"), &metadataServiceMaps); err != nil {
		render.Respond(w, r, errors.NotFoundf("error getting metadata"))
		return
	}

	layers := []models.LayerMap{}

	var collectedMetadata []eve.MetadataField

	for _, metadataServiceMap := range metadataServiceMaps {
		if metadataServiceMap.NamespaceID == id {

			var metadata eve.Metadata
			if err := c.makeRequest(fmt.Sprintf("/metadata/%d", metadataServiceMap.MetadataID), &metadata); err != nil {
				render.Respond(w, r, errors.NotFoundf("error getting metadata by id %d", metadataServiceMap.MetadataID))
				return
			}

			layers = append(layers, models.LayerMap{
				Description: metadataServiceMap.Description,
				MetadataID: metadataServiceMap.MetadataID,
				StackingOrder: metadataServiceMap.StackingOrder,
				ArtifactID: id,

				Metadata: metadata,
			})


			collectedMetadata = append(collectedMetadata, metadata.Value)

		}
	}

	sort.SliceStable(layers, func(i, j int) bool {
		return layers[i].StackingOrder > layers[j].StackingOrder
	})

	mergedMetadata := make(map[string]interface{})
	for _, metadata := range collectedMetadata {
		mergedMetadata = mergemap.Merge(mergedMetadata, metadata)
	}

	response := models.LayerResponse{
		Model: baseModel,
		Layers: layers,
		EndResult: mergedMetadata,
	}

	render.Status(r, http.StatusOK)
	render.Respond(w, r, response)
}


func (c EveController) getArtifactMetadataLayers(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		render.Respond(w, r, errors.BadRequest("artifact id is not a number"))
		return
	}

	var baseModels []eve.Artifact
	if err := c.makeRequest(fmt.Sprintf("/artifacts"), &baseModels); err != nil {
		render.Respond(w, r, errors.NotFound("error getting artifacts"))
		return
	}

	var baseModel eve.Artifact

	for _, model := range baseModels {
		if model.ID == id {
			baseModel = model
		}
	}

	var metadataServiceMaps []eve.MetadataServiceMap
	if err := c.makeRequest(fmt.Sprintf("/metadata/service-maps"), &metadataServiceMaps); err != nil {
		render.Respond(w, r, errors.NotFoundf("error getting metadata"))
		return
	}

	layers := []models.LayerMap{}

	var collectedMetadata []eve.MetadataField

	for _, metadataServiceMap := range metadataServiceMaps {
		if metadataServiceMap.ArtifactID == id {

			var metadata eve.Metadata
			if err := c.makeRequest(fmt.Sprintf("/metadata/%d", metadataServiceMap.MetadataID), &metadata); err != nil {
				render.Respond(w, r, errors.NotFoundf("error getting metadata by id %d", metadataServiceMap.MetadataID))
				return
			}

			layers = append(layers, models.LayerMap{
				Description: metadataServiceMap.Description,
				MetadataID: metadataServiceMap.MetadataID,
				StackingOrder: metadataServiceMap.StackingOrder,
				ArtifactID: id,

				Metadata: metadata,
			})


			collectedMetadata = append(collectedMetadata, metadata.Value)

		}
	}

	sort.SliceStable(layers, func(i, j int) bool {
		return layers[i].StackingOrder > layers[j].StackingOrder
	})

	mergedMetadata := make(map[string]interface{})
	for _, metadata := range collectedMetadata {
		mergedMetadata = mergemap.Merge(mergedMetadata, metadata)
	}

	response := models.LayerResponse{
		Model: baseModel,
		Layers: layers,
		EndResult: mergedMetadata,
	}

	render.Status(r, http.StatusOK)
	render.Respond(w, r, response)
}

func (c EveController) getClusterMetadataLayers(w http.ResponseWriter, r *http.Request) {

	idStr := chi.URLParam(r, "id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		render.Respond(w, r, errors.BadRequest("cluster id is not a number"))
		return
	}

	var baseModels []eve.Cluster
	if err := c.makeRequest(fmt.Sprintf("/clusters"), &baseModels); err != nil {
		render.Respond(w, r, errors.NotFound("error getting clusters"))
		return
	}

	var baseModel eve.Cluster

	for _, model := range baseModels {
		if model.ID == idStr {
			baseModel = model
		}
	}

	var metadataServiceMaps []eve.MetadataServiceMap
	if err := c.makeRequest(fmt.Sprintf("/metadata/service-maps"), &metadataServiceMaps); err != nil {
		render.Respond(w, r, errors.NotFoundf("error getting metadata"))
		return
	}

	layers := []models.LayerMap{}

	var collectedMetadata []eve.MetadataField

	for _, metadataServiceMap := range metadataServiceMaps {
		if metadataServiceMap.ClusterID == id {

			var metadata eve.Metadata
			if err := c.makeRequest(fmt.Sprintf("/metadata/%d", metadataServiceMap.MetadataID), &metadata); err != nil {
				render.Respond(w, r, errors.NotFoundf("error getting metadata by id %d", metadataServiceMap.MetadataID))
				return
			}

			layers = append(layers, models.LayerMap{
				Description: metadataServiceMap.Description,
				MetadataID: metadataServiceMap.MetadataID,
				StackingOrder: metadataServiceMap.StackingOrder,
				ClusterID: id,

				Metadata: metadata,
			})


			collectedMetadata = append(collectedMetadata, metadata.Value)

		}
	}

	sort.SliceStable(layers, func(i, j int) bool {
		return layers[i].StackingOrder > layers[j].StackingOrder
	})

	mergedMetadata := make(map[string]interface{})
	for _, metadata := range collectedMetadata {
		mergedMetadata = mergemap.Merge(mergedMetadata, metadata)
	}

	response := models.LayerResponse{
		Model: baseModel,
		Layers: layers,
		EndResult: mergedMetadata,
	}

	render.Status(r, http.StatusOK)
	render.Respond(w, r, response)
}

func (c EveController) getLayers(w http.ResponseWriter, r *http.Request, modelType string, layerType string) {

	id := chi.URLParam(r, "id")

	isDefinition := layerType == "definition"

	// Used to pluralize definitions if needed
	addedString := ""
	if isDefinition {
		addedString = "s"
	}

	layers := []models.LayerMap{}
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

	var baseModel interface{}
	if err := c.makeRequest(fmt.Sprintf("/%s/%s", modelType, id), &baseModel); err != nil {
		render.Respond(w, r, errors.NotFoundf("error getting base model"))
		return
	}

	sort.SliceStable(layers, func(i, j int) bool {
		return layers[i].StackingOrder > layers[j].StackingOrder
	})
	response := models.LayerResponse{
		Model:     baseModel,
		Layers:    layers,
		EndResult: endResult,
	}

	render.Status(r, http.StatusOK)
	render.Respond(w, r, response)

}

// We can update this method to accept an enum or something to determine which api to go to and what to strip off
func (c EveController) getMetadata(path string, model interface{}) error {

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

