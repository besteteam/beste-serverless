SHELL = /bin/bash

.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

setup-web:
	cd web && yarn

setup-deploy:
	cd deploy && yarn

setup: setup-web setup-deploy		## install everything

build-web:
	cd web && yarn build

build: build-web

cdk-deploy:		## deploy what's already built (might result in deploying old builds)
	cd deploy && yarn cdk deploy BesteWebStackProd

deploy: setup build cdk-deploy		## deploy web app

dev:		## start dev server
	cd web && yarn dev