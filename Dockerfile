# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18 as build

WORKDIR /usr/src/app

COPY service/package*.json ./

USER 0
RUN npm ci --only=production
RUN npm install @nestjs/cli
USER 1001

COPY service/ .

RUN npm run build

# Production stage
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

ENV PORT=8080
EXPOSE 8080

CMD [ "node", "dist/main.js" ]