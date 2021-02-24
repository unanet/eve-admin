package handler

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"gitlab.unanet.io/devops/cloud-admin/internal/manager"
	"gitlab.unanet.io/devops/go/pkg/middleware"
	"gitlab.unanet.io/devops/go/pkg/oidcprovider"
	"net/http"
	"time"
)

// AuthController is the Controller/Handler for oidc callback route
type AuthController struct {
	state string
	oidc  *oidcprovider.Service
}

// NewAuthController creates a new OIDC controller
func NewAuthController(mgr *manager.Service) *AuthController {
	return &AuthController{
		state: "somestate",
		oidc:  mgr.OpenIDService(),
	}
}

// Setup satisfies the EveController interface for setting up the
func (c AuthController) Setup(r *Routers) {
	r.Anonymous.HandleFunc("/oidc/callback", c.callback)
	r.Anonymous.HandleFunc("/auth", c.auth)
}

func (c AuthController) auth(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	unknownToken := jwtauth.TokenFromHeader(r)

	if len(unknownToken) == 0 {
		middleware.Log(ctx).Debug("unknown token")
		http.Redirect(w, r, c.oidc.AuthCodeURL(c.state), http.StatusFound)
		return
	}

	verifiedToken, err := c.oidc.Verify(ctx, unknownToken)
	if err != nil {
		middleware.Log(ctx).Debug("invalid token")
		http.Redirect(w, r, c.oidc.AuthCodeURL(c.state), http.StatusFound)
		return
	}

	render.Respond(w, r, fmt.Sprintf("hello %s %s", verifiedToken.Subject, verifiedToken.Audience))
}


func (c AuthController) callback(w http.ResponseWriter, r *http.Request) {
	if r.URL.Query().Get("state") != c.state {
		http.Error(w, "state did not match", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	oauth2Token, err := c.oidc.Exchange(ctx, r.URL.Query().Get("code"))
	if err != nil {
		render.Respond(w, r, err)
		return
	}

	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		render.Respond(w, r, err)
		return
	}

	idToken, err := c.oidc.Verify(ctx, rawIDToken)
	if err != nil {
		render.Respond(w, r, err)
		return
	}

	var idTokenClaims = new(json.RawMessage)
	if err := idToken.Claims(&idTokenClaims); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, TokenResponse{
		AccessToken:  oauth2Token.AccessToken,
		RefreshToken: oauth2Token.RefreshToken,
		TokenType:    oauth2Token.TokenType,
		Expiry:       oauth2Token.Expiry,
		Claims:       idTokenClaims,
	})
}

type TokenResponse struct {
	AccessToken  string           `json:"access_token"`
	RefreshToken string           `json:"refresh_token"`
	TokenType    string           `json:"token_type"`
	Expiry       time.Time        `json:"expiry"`
	Claims       *json.RawMessage `json:"claims"`
}
