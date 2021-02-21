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
CUR_DIR := $(shell pwd)

NODE_BUILD_IMAGE := unanet-docker.jfrog.io/node
GO_BUILD_IMAGE := unanet-docker.jfrog.io/golang

IMAGE_NAME := unanet-docker-int.jfrog.io/ops/cloud-admin
LABEL_PREFIX := com.unanet
IMAGE_LABELS := \
	--label "${LABEL_PREFIX}.git_commit_sha=${CI_COMMIT_SHORT_SHA}" \
	--label "${LABEL_PREFIX}.gitlab_project_id=${CI_PROJECT_ID}" \
	--label "${LABEL_PREFIX}.build_number=${BUILD_NUMBER}" \
	--label "${LABEL_PREFIX}.version=${VERSION}"

docker-scanner-exec = docker run --rm \
	-e SONAR_TOKEN=${SONARQUBE_TOKEN} \
	-e SONAR_HOST_URL=https://sonarqube.unanet.io \
	-v $(CUR_DIR):/usr/src \
	--user="${DOCKER_UID}:${DOCKER_GID}" \
	sonarsource/sonar-scanner-cli sonar-scanner -Dsonar.projectKey=cloud-admin -Dsonar.exclusions=**/*_test.go,**/*mock*.go


docker-go-exec = docker run --rm \
	-e DOCKER_UID=${DOCKER_UID} \
	-e DOCKER_GID=${DOCKER_GID} \
	-v ${CUR_DIR}:/src \
	-v ${MODCACHE}:/go/pkg/mod \
	-v ${HOME}/.ssh/id_rsa:/home/unanet/.ssh/id_rsa \
	-w /src \
	${GO_BUILD_IMAGE}


docker-node-exec = docker run --rm \
	-e DOCKER_UID=${DOCKER_UID} \
	-e DOCKER_GID=${DOCKER_GID} \
	-v ${CUR_DIR}:/src \
	-v ${HOME}/.ssh/id_rsa:/home/unanet/.ssh/id_rsa \
	-w /src \
	${NODE_BUILD_IMAGE}	


check-tag = !(git rev-parse -q --verify "refs/tags/v${PATCH_VERSION}" > /dev/null 2>&1) || \
	(echo "the version: ${PATCH_VERSION} has been released already" && exit 1)


.PHONY: build dist test check_version

build: check_version
	docker pull ${GO_BUILD_IMAGE}
	docker pull ${NODE_BUILD_IMAGE}
	docker pull unanet-docker.jfrog.io/alpine-base
	mkdir -p bin
	$(docker-go-exec) go build -ldflags="-X 'gitlab.unanet.io/devops/cloud-admin/internal/api/api.Version=${VERSION}'" \
		-o ./bin/cloud-admin ./cmd/cloud-admin/main.go
	docker build ${IMAGE_LABELS} . -t ${IMAGE_NAME}:${PATCH_VERSION}

test:
	docker pull ${GO_BUILD_IMAGE}
	docker pull ${NODE_BUILD_IMAGE}
	$(docker-go-exec) go test -tags !local ./...	
	$(docker-node-exec) npm run test
	
dist: build
	docker push ${IMAGE_NAME}:${PATCH_VERSION}
	curl --fail -H "X-JFrog-Art-Api:${JFROG_API_KEY}" \
		-X PUT \
		https://unanet.jfrog.io/unanet/api/storage/docker-int-local/ops/cloud-admin/${PATCH_VERSION}\?properties=version=${VERSION}%7Cgitlab-build-properties.project-id=${CI_PROJECT_ID}%7Cgitlab-build-properties.git-sha=${CI_COMMIT_SHORT_SHA}%7Cgitlab-build-properties.git-branch=${CI_COMMIT_BRANCH}