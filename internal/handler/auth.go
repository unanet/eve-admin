package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"gitlab.unanet.io/devops/go/pkg/oidcprovider"
	"golang.org/x/oauth2"
)

// AuthController is the Controller/Handler for oidc callback route
type AuthController struct {
	state string
	oidc  *oidcprovider.Service
}

// NewAuthController creates a new OIDC controller
func NewAuthController(oidc *oidcprovider.Service) *AuthController {
	return &AuthController{
		state: "somestate",
		oidc:  oidc,
	}
}

// Setup satisfies the EveController interface for setting up the
func (c AuthController) Setup(r *Routers) {
	r.Anonymous.HandleFunc("/oidc/callback", c.callback)
	r.Anonymous.HandleFunc("/auth", c.auth)
}

func (c AuthController) auth(w http.ResponseWriter, r *http.Request) {
	rawAccessToken := r.Header.Get("Authorization")
	if rawAccessToken == "" {
		http.Redirect(w, r, c.oidc.AuthCodeURL(c.state), http.StatusFound)
		return
	}
	parts := strings.Split(rawAccessToken, " ")
	if len(parts) != 2 {
		w.WriteHeader(400)
		return
	}
	_, err := c.oidc.Verifier.Verify(r.Context(), parts[1])

	if err != nil {
		http.Redirect(w, r, c.oidc.AuthCodeURL(c.state), http.StatusFound)
		return
	}

	w.Write([]byte("hello world"))
}

func (c AuthController) callback(w http.ResponseWriter, r *http.Request) {
	if r.URL.Query().Get("state") != c.state {
		http.Error(w, "state did not match", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	oauth2Token, err := c.oidc.Exchange(ctx, r.URL.Query().Get("code"))
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "No id_token field in oauth2 token.", http.StatusInternalServerError)
		return
	}

	idToken, err := c.oidc.Verifier.Verify(ctx, rawIDToken)
	if err != nil {
		http.Error(w, "Failed to verify ID Token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp := struct {
		OAuth2Token   *oauth2.Token
		IDTokenClaims *json.RawMessage // ID Token payload is just JSON.
	}{oauth2Token, new(json.RawMessage)}

	if err := idToken.Claims(&resp.IDTokenClaims); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := json.MarshalIndent(resp, "", "    ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(data)

}
