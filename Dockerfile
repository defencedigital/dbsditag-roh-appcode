# Initialize arguments
ARG NODE_VERSION=nodejs-20:1-15
ARG NPM_VERSION=10.2.4
ARG RED_HAT_REGISTRY=registry.access.redhat.com/ubi9

# Use Node.js 18 image from Red Hat's registry as build stage
FROM ${RED_HAT_REGISTRY}/${NODE_VERSION} as build-stage

# Set the working directory to /app
WORKDIR /app

# Switch to root user for installing packages
USER 0

# Install corepack, enable it, install specific npm version and other global packages
RUN npm install -g corepack && corepack enable
RUN npm install -g npm@${NPM_VERSION}
RUN npm install -g rimraf "@nestjs/cli" graphql "@nestjs/graphql"

# Install project dependencies and build the project
RUN yarn install
RUN yarn build

# Switch back to non-root user
USER 1001

# Copy the service directory into the Docker image
COPY service/ .

# Use Node.js 18 image from Red Hat's registry for the final image
FROM ${RED_HAT_REGISTRY}/${NODE_VERSION}

# Copy the built app from the build stage into the final image
COPY --from=build-stage /app/ "${HOME}"

# Set the command to start the app
CMD [ "node", "dist/main.js" ]

# Expose port 8080
EXPOSE 8080