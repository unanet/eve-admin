package manager

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"gitlab.unanet.io/devops/cloud-admin/internal/config"
	"gitlab.unanet.io/devops/go/pkg/errors"
	"gitlab.unanet.io/devops/go/pkg/middleware"
	"gitlab.unanet.io/devops/go/pkg/oidcprovider"
	"go.uber.org/zap"
	"net/http"
)

// Key to use when setting the request ID.
type ctxKeyTokenClaimsID int

// TokenClaimsRequestIDKey is the key that holds the unique Token Claims ID in a request context.
const TokenClaimsRequestIDKey ctxKeyTokenClaimsID = 0

func OpenIDConnectOpt(oidc *oidcprovider.Service) Option {
	return func(svc *Service) {
		svc.oidc = oidc
	}
}

type Option func(*Service)

type Service struct {
	cbstate string
	cfg *config.Config
	oidc  *oidcprovider.Service
}

func (s *Service) OpenIDService() *oidcprovider.Service {
	return s.oidc
}

func NewService(cfg *config.Config, opts ...Option) *Service {
	svc := &Service{cfg: cfg, cbstate: "some_cb_state"}

	for _, opt := range opts {
		opt(svc)
	}

	return svc

}


func (s *Service) AuthenticationMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		hfn := func(w http.ResponseWriter, r *http.Request) {

			ctx := r.Context()
			unknownToken := jwtauth.TokenFromHeader(r)

			if len(unknownToken) == 0 {
				render.Respond(w, r, errors.ErrUnauthorized)
				return
			}

			verifiedToken, err := s.oidc.Verify(ctx, unknownToken)
			if err != nil {
				middleware.Log(ctx).Debug("invalid token", zap.Error(err))
				http.Redirect(w, r, s.oidc.AuthCodeURL(s.cbstate), http.StatusFound)
				return
			}

			//var idTokenClaims = new(json.RawMessage)
			var claims = new(jwt.MapClaims)
			if err := verifiedToken.Claims(&claims); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			next.ServeHTTP(w, r.WithContext(context.WithValue(ctx, TokenClaimsRequestIDKey, claims)))
		}
		return http.HandlerFunc(hfn)
	}
}


// GetTokenClaims returns the verified token claims
// Returns nil if unknown
func (s *Service) GetTokenClaims(ctx context.Context) jwt.MapClaims {
	if ctx == nil {
		return nil
	}
	if claims, ok := ctx.Value(TokenClaimsRequestIDKey).(jwt.MapClaims); ok {
		return claims
	}
	return nil
}