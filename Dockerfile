FROM registry.access.redhat.com/ubi9/nodejs-20 as build-stage

WORKDIR /app

USER 0
COPY service/ .
RUN npm install
USER 1001

FROM registry.access.redhat.com/ubi9/nodejs-20
COPY --from=build-stage /app/ "${HOME}"
CMD [ "node", "dist/main.js" ]

EXPOSE 8080
