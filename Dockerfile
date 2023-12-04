FROM registry.access.redhat.com/ubi9/nodejs-18 as build-stage

WORKDIR /app
COPY service/ .

USER 0
RUN npm install -g corepack
RUN corepack enable
RUN npm install -g npm@10.2.4
RUN npm install -g rimraf "@nestjs/cli" graphql "@nestjs/graphql"
RUN ls -la
RUN yarn install
RUN yarn build
USER 1001

FROM registry.access.redhat.com/ubi9/nodejs-18
COPY --from=build-stage /app/ "${HOME}"
CMD [ "node", "dist/main.js" ]

EXPOSE 8080
