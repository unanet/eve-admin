FROM unanet-docker.jfrog.io/alpine-base

ENV SERVICE_NAME cloud-admin
ENV LOG_LEVEL info
ENV PORT 8080
ENV METRICS_PORT 3001
ENV VAULT_ADDR https://vault.unanet.io
ENV VAULT_ROLE k8s-devops
ENV VAULT_K8S_MOUNT kubernetes

ADD ./bin/cloud-admin /app/cloud-admin
ADD ./client/dist /app/dist
WORKDIR /app
CMD ["/app/cloud-admin"]

HEALTHCHECK --interval=1m --timeout=2s --start-period=10s \
    CMD curl -f http://localhost:${METRICS_PORT}/metrics || exit 1
