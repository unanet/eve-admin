package handler

import (
	"encoding/json"
	"fmt"
	"gitlab.unanet.io/devops/go/pkg/middleware"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

	"gitlab.unanet.io/devops/cloud-admin/internal/config"

	"github.com/go-chi/render"
)

type APIProxyController struct {
	cfg     config.Config
}

func NewAPIProxyController(cfg config.Config) *APIProxyController {
	return &APIProxyController{
		cfg: cfg,
	}
}

func (c APIProxyController) Setup(r *Routers) {
	r.Auth.Get("/eve/*", c.get)
	r.Auth.Put("/eve/*", c.put)
	r.Auth.Post("/eve/*", c.post)
	r.Auth.Delete("/eve/*", c.delete)
	r.Auth.Patch("/eve/*", c.patch)

	// The plan is to have this as /api/cloud or /api/eve so we can hit different APIs
	//r.Auth.Get("/cloud/*", c.get)
	//r.Auth.Put("/cloud/*", c.put)
	//r.Auth.Post("/cloud/*", c.post)
	//r.Auth.Delete("/cloud/*", c.delete)
	//r.Auth.Patch("/cloud/*", c.patch)
}

func (c APIProxyController) stripAPIPrefix(pathToStrip string, url *url.URL) *url.URL {
	// TODO circle back and clean this up to a better way
	url.Path = strings.Replace(url.Path, "/api/eve", "", -1)
	return url
}

func (c APIProxyController) get(w http.ResponseWriter, r *http.Request) {

	proxyToURL := fmt.Sprintf("%s%s", c.cfg.EveAPIUrl, c.stripAPIPrefix("/api/eve", r.URL))

	middleware.Log(r.Context()).Info("making request to" + proxyToURL)

	resp, err := http.Get(proxyToURL)
	if err != nil {
		middleware.Log(r.Context()).Error(err.Error())
		render.Respond(w, r, "something went wrong")
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		middleware.Log(r.Context()).Error(err.Error())
		render.Respond(w, r, "something went wrong")
		return
	}
	//Convert the body to type string
	sb := string(body)

	var returnValue interface{}

	if err := json.Unmarshal([]byte(sb), &returnValue); err != nil {
		middleware.Log(r.Context()).Error(err.Error())
		render.Respond(w, r, "something went wrong")
		return
	}


	render.JSON(w, r, returnValue)
}

func (c APIProxyController) put(w http.ResponseWriter, r *http.Request) {
	c.makeRequest(w, r)
}

func (c APIProxyController) post(w http.ResponseWriter, r *http.Request) {
	c.makeRequest( w, r)
}

func (c APIProxyController) delete(w http.ResponseWriter, r *http.Request) {
	c.makeRequest(w, r)
}

func (c APIProxyController) patch(w http.ResponseWriter, r *http.Request) {
	c.makeRequest(w, r)
}

// We can update this method to accept an enum or something to determine which api to go to and what to strip off
func (c APIProxyController) makeRequest(w http.ResponseWriter, r *http.Request) {
	client := &http.Client{}

	// set the HTTP method, url, and request body
	req, err := http.NewRequest(r.Method, fmt.Sprintf("%s%s", c.cfg.EveAPIUrl, c.stripAPIPrefix("/api.eve", r.URL)), r.Body)
	if err != nil {
		middleware.Log(r.Context()).Error(err.Error())
		render.Respond(w, r, err)
		return
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	resp, err := client.Do(req)
	if err != nil {
			middleware.Log(r.Context()).Error(err.Error())
			render.Respond(w, r, err)
		return
	}

	var jsonBody interface{}

	// Ignore error if it happens here, delete won't return anything
	_ = json.NewDecoder(resp.Body).Decode(&jsonBody)

	// Set our proxies status code before forwarding the response
	render.Status(r, resp.StatusCode)

	render.Respond(w, r, jsonBody)
}


