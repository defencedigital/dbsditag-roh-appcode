# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18 as build
WORKDIR /usr/src/app
COPY service/ .
USER 0
RUN npm install -g corepack && \
    corepack enable && \
    yarn install && \
    yarn build && \
    yarn add @nestjs/cli && \
    chown -R 1001:0 /usr/src/app && chmod -R g=u /usr/src/app
USER 1001

# Production stage
FROM registry.access.redhat.com/ubi9/nodejs-20
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/ .
USER 0
RUN chown -R 1001:0 /usr/src/app && chmod -R g=u /usr/src/app && \
    chmod -R 777 /usr/src/app && \
    yum install -y --allowerasing curl jq
USER 1001
ENV PORT=8080
EXPOSE 8080
CMD [ "/bin/bash", "-c", "source /usr/src/app/preflight.sh && node dist/main.js" ]