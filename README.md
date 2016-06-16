# nodejs-demo-app

## Run on Cloud Foundry

```bash
cf create-service mongodb v3.0-container demodb

cf push

cf restage demo-nodejs
```

## Run locally

```bash
npm install
node main.js
```
(access on http://localhost:3000)
