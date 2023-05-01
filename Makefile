SHELL = /bin/bash

.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

setup-web:
	cd web && yarn

setup-api:
	cd web && yarn

setup-deploy:
	cd deploy && yarn

setup: setup-web setup-api setup-deploy		## install everything

build-web:
	cd web && yarn build

copy-api:
	cp -R ./api ./deploy/api-copy

build-api: copy-api

cdk-deploy-web:
	cd deploy && yarn cdk deploy BesteWebStackProd

cdk-deploy-api:
	cd deploy && yarn cdk deploy BesteApiStackProd

deploy-web: setup build-web cdk-deploy-web		## deploy web app

deploy-api: setup build-api cdk-deploy-api		## deploy api

web-dev:		## start dev server
	cd web && yarn dev
