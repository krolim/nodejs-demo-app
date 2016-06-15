# nodejs-demo-app

## Run on Cloud Foundry

cf push

cf create-service mongodb v3.0-container demodb

cf bind-service demo-nodejs demodb

cf restage demo-nodejs

## Run locally

npm install
node main.js

(access on http://localhost:3000)
