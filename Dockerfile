FROM unanet-docker.jfrog.io/alpine-base

ENV LOG_LEVEL info
ENV PORT 8080
ENV METRICS_PORT 3001

ADD ./bin/eve-admin /app/eve-admin
ADD ./client/dist /app/client/dist
WORKDIR /app
CMD ["/app/eve-admin"]

HEALTHCHECK --interval=1m --timeout=2s --start-period=10s \
    CMD curl -f http://localhost:${METRICS_PORT}/metrics || exit 1
