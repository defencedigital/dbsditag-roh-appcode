#!/bin/bash

# Default secret token
secretToken=${VAULT_SECRET:-"NO_SECRET_HERE"}
secretLocation="/var/run/secrets/kubernetes.io/serviceaccount/token"

echo $DB_URL

if [[ -z "$DB_URL" ]]; then
    echo "Error: DB_URL is not set"
    exit 1
fi

# Read the Kubernetes service account token if it exists
if [ -f "$secretLocation" ]; then
    secretToken=$(cat $secretLocation)
    echo "Found secret token"
    echo $secretToken
fi

# if the value of VAULT_SECRET equals "NO_SECRET_HERE" then skip to the end
if [ $VAULT_SECRET = "NO_SECRET_HERE" ]; then
    echo "Skipping Vault"
#    curl -o ./dist/database/afmd.db $DB_URL
#    chmod 777 ./dist/database/afmd.db
    exit 0
fi

# Send a login request to Vault
response=$(curl -H "X-Vault-Namespace: $VAULT_NAMESPACE" --request POST  \
    --data "{\"role\": \"$VAULT_ROLE\", \"jwt\": \"$secretToken\"}" \
    $VAULT_ADDR/auth/kubernetes/login)

echo $response

# Extract the Vault token from the response
token=$(echo $response | jq -r '.auth.client_token')

echo $token

# Retrieve the secrets from Vault
secrets=$(curl -H "X-Vault-Token: $token" -H "X-Vault-Namespace: $VAULT_NAMESPACE" \
               --request GET $VAULT_ADDR/$VAULT_KEY)

echo $secrets

# Extract the data from the secrets
data=$(echo $secrets | jq -r '.data.data')
echo $data


# Export the secrets as environment variables
for key in $(echo $data | jq -r 'keys[]'); do
    value=$(echo $data | jq -r --arg key "$key" '.[$key]')
    echo "$key=$value" >> .env
    export $key="$value"
done

# Download the database

#curl -o ./dist/database/afmd.db $DB_URL
#chmod 777 ./dist/database/afmd.db

exit 0
