# Beste Serverless

## Get started

```
git clone <this repo>
cd path/to/project
make setup
make dev
```

## TODO

- [ ] Structured way of migrating db: https://spin.atomicobject.com/2020/10/20/dynamodb-migrate-data-structures/
- [x] Deploy frontend as static, for easier testing of api
- [x] Deploy api as lambda
  - [x] Verify that bundle size is not too big
- [ ] Cognito
- [x] Single repo for both
- [ ] Remove API key auth in API
- [ ] Google provider for Cognito
- [ ] Make Apollo talk to Cognito. Preferably with JWT
- [ ] Sign in from frontend
- [ ] Proper local env
  - [ ] Dynamodb
  - [x] Apollo
    - [x] hot reload?
  - [x] Frontend
  - [ ] Cognito https://github.com/jagregory/cognito-local
