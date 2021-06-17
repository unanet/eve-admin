module gitlab.unanet.io/devops/cloud-admin

go 1.16

//replace gitlab.unanet.io/devops/go => ../go

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/go-chi/chi v4.1.2+incompatible
	github.com/go-chi/cors v1.1.1
	github.com/go-chi/jwtauth v4.0.4+incompatible
	github.com/go-chi/render v1.0.1
	github.com/kelseyhightower/envconfig v1.4.0
	gitlab.unanet.io/devops/eve v0.17.5
	gitlab.unanet.io/devops/go v1.6.0
	go.uber.org/zap v1.16.0
)
