#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BesteWebStack } from "../lib/BesteWebStack";

const app = new cdk.App();
new BesteWebStack(app, "BesteWebStackProd", {
  env: { account: "897469443626", region: "eu-west-1" },
  envName: "prod",
  domainName: "bestetipset.se",
  siteSubDomain: "www",
});
