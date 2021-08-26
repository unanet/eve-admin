CI_COMMIT_BRANCH ?= local
CI_COMMIT_SHORT_SHA ?= 000001
CI_PROJECT_ID ?= 0
CI_PIPELINE_IID ?= 0
GOPATH ?= ${HOME}/go
MODCACHE ?= ${GOPATH}/pkg/mod
BUILD_NUMBER := ${CI_PIPELINE_IID}
PATCH_VERSION := $(shell cat VERSION)
VERSION := ${PATCH_VERSION}.${BUILD_NUMBER}
DOCKER_UID = $(shell id -u)
DOCKER_GID = $(shell id -g)
PROJECT_NAME := $(shell basename $(CURDIR))
CUR_DIR := $(shell pwd)
NPMCACHE ?= ${CUR_DIR}/node_modules
NODE_BUILD_IMAGE := node
GO_BUILD_IMAGE := golang
IMAGE_NAME := ${PROJECT_NAME}

docker-go-exec = docker run --rm \
	-e DOCKER_UID=${DOCKER_UID} \
	-e DOCKER_GID=${DOCKER_GID} \
	-v ${CUR_DIR}:/src \
	-v ${MODCACHE}:/go/pkg/mod \
	-w /src \
	${GO_BUILD_IMAGE}

docker-node-exec = docker run --rm \
	-e DOCKER_UID=${DOCKER_UID} \
	-e DOCKER_GID=${DOCKER_GID} \
	-v ${CUR_DIR}/client:/app/ \
	-w /app \
	${NODE_BUILD_IMAGE}

check-tag = !(git rev-parse -q --verify "refs/tags/v${PATCH_VERSION}" > /dev/null 2>&1) || \
	(echo "the version: ${PATCH_VERSION} has been released already" && exit 1)

.PHONY: build dist test check_version

build-client: 
	docker pull ${NODE_BUILD_IMAGE}
	$(docker-node-exec) npm install
	$(docker-node-exec) npm run build:prod

build-server: 
	docker pull ${GO_BUILD_IMAGE}
	mkdir -p bin
	$(docker-go-exec) go build -ldflags="-X 'github.com/unanet/${PROJECT_NAME}/internal/handler.Version=${VERSION}'" \
		-o ./bin/${PROJECT_NAME} ./cmd/${PROJECT_NAME}/main.go

build: check_version build-client build-server
	docker pull unanet-docker.jfrog.io/alpine-base
	docker build ${IMAGE_LABELS} . -t ${IMAGE_NAME}:${PATCH_VERSION}

test:
	docker pull ${GO_BUILD_IMAGE}
	docker pull ${NODE_BUILD_IMAGE}
	$(docker-go-exec) go test -tags !local ./...	
	$(docker-node-exec) npm run test
