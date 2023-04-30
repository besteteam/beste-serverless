SHELL = /bin/bash

.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

setup:
	cd beste-web && yarn && cd deploy && yarn

build:
	cd beste-web && yarn build

cdk-deploy:
	cd deploy && yarn cdk deploy BesteNextServerlessStack

deploy: setup build cdk-deploy		## deploy web app

dev:		## start dev server
	cd beste-web && yarn dev
