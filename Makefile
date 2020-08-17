CI_COMMIT_BRANCH ?= local
CI_COMMIT_SHORT_SHA ?= 000001
CI_PROJECT_ID ?= 0
CI_PIPELINE_IID ?= 0

BUILD_NUMBER := ${CI_PIPELINE_IID}
VERSION_WITHOUT_BUILD := 0.0.0
VERSION := ${VERSION_WITHOUT_BUILD}.${BUILD_NUMBER}

DOCKER_UID = $(shell id -u)
DOCKER_GID = $(shell id -g)

CUR_DIR := $(shell pwd)

BUILD_IMAGE := unanet-docker.jfrog.io/node:14.0.0
CADDY_IMAGE := unanet-docker.jfrog.io/caddy
UNANET_IMAGE_NAME := unanet-docker-int.jfrog.io/unanet/subcontractor
BUILDER_IMAGE := subcontractor:${CI_PIPELINE_IID}

LABEL_PREFIX := com.unanet
IMAGE_LABELS := \
	--label "${LABEL_PREFIX}.git_commit_sha=${CI_COMMIT_SHORT_SHA}" \
	--label "${LABEL_PREFIX}.gitlab_project_id=${CI_PROJECT_ID}" \
	--label "${LABEL_PREFIX}.build_number=${BUILD_NUMBER}" \
	--label "${LABEL_PREFIX}.version=${VERSION}"

IMAGE_TAGS := \
	-t "${UNANET_IMAGE_NAME}:${VERSION_WITHOUT_BUILD}" \
	-t "${UNANET_IMAGE_NAME}:${VERSION}"

YARN_CACHE := ${HOME}/.docker_cache

docker-exec = docker run --rm ${BUILD_IMAGE}
builder-exec = docker run --rm ${BUILDER_IMAGE}

.PHONY: build dist pull test

pull:
	docker pull ${CADDY_IMAGE}

docker-image: pull
	docker build ${IMAGE_LABELS} ${IMAGE_TAGS} .

docker-dist: docker-image
	docker push ${UNANET_IMAGE_NAME}:${VERSION}
	docker push ${UNANET_IMAGE_NAME}:${VERSION_WITHOUT_BUILD}
	curl --fail -H "X-JFrog-Art-Api:${JFROG_API_KEY}" \
		-X PUT \
		https://unanet.jfrog.io/unanet/api/storage/docker-int-local/unanet/cloud-admin/${VERSION}\?properties=version=${VERSION}%7Cgitlab-build-properties.project-id=${CI_PROJECT_ID}%7Cgitlab-build-properties.git-sha=${CI_COMMIT_SHORT_SHA}%7Cgitlab-build-properties.git-branch=${CI_COMMIT_BRANCH}	
