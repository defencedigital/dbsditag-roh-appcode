# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-18 as build
WORKDIR /usr/src/app
COPY service/ .
USER 0
RUN npm install -g corepack && \
    corepack enable && \
    yarn install --immutable --immutable-cache --check-cache && \
    yarn build && \
    yarn add @nestjs/cli @nestjs/graphql graphql  && \
    chown -R 1001:0 /usr/src/app && chmod -R g=u /usr/src/app
COPY afmd.db /usr/src/app/dist/database/afmd.db
USER 1001

# Production stage
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal
WORKDIR /usr/src/app
RUN mkdir -p /etc/ssl/certs

COPY --from=build /usr/src/app/ .

USER 0
COPY tools/curl /usr/bin/curl
COPY tools/jq /usr/bin/jq
COPY tools/preflight.sh /usr/src/app/preflight.sh
COPY tools/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

RUN chmod +x /usr/bin/curl && \
    chmod +x /usr/bin/jq && \
    chown -R 1001:0 /usr/src/app && chmod -R g=u /usr/src/app && \
    chmod -R 777 /usr/src/app
USER 1001
ENV PORT=8080
ENV DB_URL=https://rollofhonour.s3.eu-west-1.amazonaws.com/afmd.db
ENV VAULT_ADDR=https://vault-openshift.apps.ocp4.lab.unixnerd.org
ENV VAULT_SECRET=eyJhbGciOiJSUzI1NiIsImtpZCI6Il9yUFhTb0FvTXZ6Q3F5ODFYWldCS0pfcnNsYU9vbW5WVzFSNUpDWkItUDQifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjIl0sImV4cCI6MTczNTIwOTAzMiwiaWF0IjoxNzAzNjczMDMyLCJpc3MiOiJodHRwczovL2t1YmVybmV0ZXMuZGVmYXVsdC5zdmMiLCJrdWJlcm5ldGVzLmlvIjp7Im5hbWVzcGFjZSI6Im90aGVyLWF1dG9nYXJhZ2UtcG9jIiwicG9kIjp7Im5hbWUiOiJkYnNkaXRhZy1yb2gtNjdkNDY3ODQ3OS10NjVqNiIsInVpZCI6Ijc5ODAzZDdmLTdiNzItNGQ5Yi1hNGI2LTQ3MzEyMjk5YmNmZCJ9LCJzZXJ2aWNlYWNjb3VudCI6eyJuYW1lIjoiZGVmYXVsdCIsInVpZCI6ImJjZjg4NmM1LTQ1MDgtNGM5NS1hYThmLTg1ZDY4YWMzYjcxMSJ9LCJ3YXJuYWZ0ZXIiOjE3MDM2NzY2Mzl9LCJuYmYiOjE3MDM2NzMwMzIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpvdGhlci1hdXRvZ2FyYWdlLXBvYzpkZWZhdWx0In0.OAKj8WfZpCX_IBzFKsSI4edAW6PEXmNIzA3PinhYikuCM8xjk1Y5qYE0VcwqVW4afXRXYXafovH-ZBiRPiqIwyl1RkjvuExh_1DwIJkttR54IX_1w_HNkzGg-9Y51JHN5fSbogsPvBjBVLNuTjcayP5IpFSNFmwY_TyyKcG_zeR0wRQVMZqxvfhHWf6jMqJ9_HlDhLbRiy1mm67MBS9PNiyCGT_KnWrPassFjOt2tPY4vsNZFcccQsESu8nzKWYTjNwbDJ8Sb7Q_97Ne7AkgBHpxDssMr3AQSbxj1H0WE5BrcLDYqJwNC2bkd4rskh93Doyt3B1BKl2LmD-v1x-OuIY4Ui5fNnWgLNzPJd5wfBoX3p5lpDJ4NFjpGQaAPb5X1pLHE3rjAdmN-wbo7sJWL_K-4bQwfH9qKdESjCKUVlBxQPYaTWWjKqXPB1SnMho2LCoKgcTRWmdFMz0ucJU3LpQ74QaB3U8B1Uh6ralUVmGYJDIBfV5A2_lI7FYJHWbbIuBHR93XJyf1mHuR5anNt--vdl1WKIfY6pfAviFOv8kZ_7_fPiPo47oQy-QlXDEPA4EEd8o-TTt7MJHZ4Oc6MqXQ895g5LCmBVpNJhuvrIrdfgCiLAUd4v1miWk04veZPwzAePHtfQq6NIB-v83yRPQYEG2T0fHKKmQjnBjJ_VE
ENV VAULT_NAMESPACE=other-autogarage-poc
ENV VAULT_ROLE=service-reader
ENV VAULT_ADDR=https://vault-dso-tooling-vault.apps.ocp1.azure.dso.digital.mod.uk/v1
ENV VAULT_KEY=kv/data/dbsditag-roh

EXPOSE 8080
CMD [ "/bin/bash", "-c", "source /usr/src/app/preflight.sh && node dist/main.js" ]