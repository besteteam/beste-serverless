#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BesteApiStack } from "../lib/ApiStack";
import { BesteWebStack } from "../lib/WebStack";

const app = new cdk.App();
// new BesteApiStack(app, "BesteApiStackProd", {
//   env: { account: "897469443626", region: "eu-west-1" },
//   domainName: "bestetipset.se",
//   siteSubDomain: "api",
// });

new BesteWebStack(app, "BesteWebStackProd", {
  env: { account: "897469443626", region: "eu-west-1" },
  envName: "prod",
  domainName: "bestetipset.se",
  siteSubDomain: "www",
});
