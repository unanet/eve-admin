# ARG BUILD_IMG
# FROM ${BUILD_IMG} as build

# # Copy the packaging so we only have to do this when we change the library
# COPY package.json yarn.lock /src/
# COPY apps/portal/package.json /src/apps/portal/
# COPY packages/unanet-sdk/package.json /src/packages/unanet-sdk/

# # Yarn install
# WORKDIR /src
# RUN yarn --no-progress --frozen-lockfile

# # Build the static files
# COPY ./ /src/
# RUN yarn build

FROM unanet-docker.jfrog.io/caddy
# ENV SPA_INDEX /subcontractor/index.html
# COPY --from=build /src/apps/portal/build/ /usr/share/caddy/subcontractor
