# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18 as build

WORKDIR /usr/src/app

COPY service/package*.json ./

USER 0
RUN npm ci --only=production
RUN npm install @nestjs/cli
USER 1001

COPY service/ .
USER 0
RUN npm run build
USER 1001
# Production stage
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/node_modules ./node_modules

RUN touch /usr/src/app/afmd.db
RUN chown 1001:0 /usr/src/app/afmd.db

ENV PORT=8080
EXPOSE 8080

CMD [ "node", "dist/main.js" ]