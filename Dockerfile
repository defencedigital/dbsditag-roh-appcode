# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18 as build

WORKDIR /usr/src/app

COPY service/package*.json ./

USER 0
RUN npm ci --only=production --omit=dev
RUN npm install @nestjs/cli
USER 1001

COPY service/ .
USER 0
RUN npm run build
USER 1001
# Production stage
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/ .

USER 0

USER 1001

ENV PORT=8080
EXPOSE 8080

CMD [ "node", "dist/main.js" ]