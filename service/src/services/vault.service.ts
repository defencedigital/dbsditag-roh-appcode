import fetch from 'node-fetch';
const fs = require('fs');

export class VaultService {
    private secretLocation = '/var/run/secrets/kubernetes.io/serviceaccount/token';

    async loadFromVault() {
        let token = process.env.VAULT_SECRET ?? '';

        if(fs.existsSync(this.secretLocation)) {
            token = fs.readFileSync(this.secretLocation, 'utf8');
        }

        const content = await fetch(`${process.env.VAULT_ADDR}/auth/kubernetes/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Vault-Namespace': process.env.OC_NAMESPACE,
            },
            body: JSON.stringify({
                role: process.env.VAULT_ROLE,
                jwt: token
            })
        });

        const json = await content.json();

        if(json.auth) {
            token = json.auth.client_token;

            const secrets = await fetch(`${process.env.VAULT_ADDR}/${process.env.VAULT_KEY}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Vault-Namespace': process.env.OC_NAMESPACE,
                    'X-Vault-Token': token
                }
            });
            const secretsJson = await secrets.json();

            for(const key in secretsJson.data.data) {
                process.env[key] = secretsJson.data.data[key];
            }

            return;
        }

        return;
    }
}