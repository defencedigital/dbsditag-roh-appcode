# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18 as build

WORKDIR /usr/src/app

# Copying the service directory from the host to the current location (/usr/src/app) in the container
COPY service/ .

USER 0

RUN npm install -g corepack

RUN corepack enable

RUN npm install -g npm@10.2.5

RUN yarn install

RUN yarn build

RUN yarn add @nestjs/cli

RUN chown -R 1001:0 /usr/src/app && chmod -R g=u /usr/src/app

USER 1001
# Production stage
FROM registry.access.redhat.com/ubi9/nodejs-20

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/ .

USER 0
RUN chown -R 1001:0 /usr/src/app && chmod -R g=u /usr/src/app
RUN chmod -R 777 /usr/src/app
RUN yum install -y --allowerasing curl jq
USER 1001

ENV PORT=8080
EXPOSE 8080

CMD [ "/bin/bash", "-c", "source /usr/src/app/preflight.sh && node dist/main.js" ]