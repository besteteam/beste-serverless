import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

const rootDomain = "bestetipset.se";
const subDomain = "dev-api";
const fullDomain = `${subDomain}.${rootDomain}`;

export class BesteApiServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, "GraphqlLambda", {
      runtime: Runtime.NODEJS_18_X,
      //   entry: path.join(__dirname, `/../functions/addUserLambda.ts`),
      entry: path.join(__dirname, `../src/server.ts`),
      handler: "handler",
      // environment: {
      //   TABLENAME: userTable.tableName,
      // },
    });

    // const graphqlLambda = new lambda.Function(this, "graphqlLambda", {
    //   // Where our function is located - in that case, in `lambda` directory at the root of our project
    //   code: lambda.Code.fromAsset(path.join(__dirname, "../lambda")),
    //   // What should be executed once the lambda is invoked - in that case, the `handler` function exported by `graphql.ts`
    //   handler: "graphql.handler",
    //   // Our runtime of choice - in that case, node.js 12.x
    //   runtime: lambda.Runtime.NODEJS_12_X,
    // });

    // API stuff
    const zone = cdk.aws_route53.HostedZone.fromLookup(this, "BaseZone", {
      domainName: rootDomain,
    });

    // TLS certificate
    const certificate = new cdk.aws_certificatemanager.Certificate(
      this,
      "ApiCertificate",
      {
        domainName: fullDomain,
        validation: CertificateValidation.fromDns(zone),
        // hostedZone: zone,
        // region: "eu-west-1",
      }
    );

    // const api = new apigateway.RestApi(this, "ClockApi", {
    //   restApiName: "Clock Service",
    //   description: "This service serves the current time.",
    //   domainName: {
    //     domainName: fullDomain,
    //     certificate: certificate,
    //     endpointType: apigateway.EndpointType.REGIONAL,
    //   },
    // });
    const api = new LambdaRestApi(this, "GraphqlEndpoint", {
      handler: lambda,
      domainName: { domainName: fullDomain, certificate },
    });

    new cdk.aws_route53.ARecord(this, "apiDNS", {
      zone: zone,
      recordName: subDomain,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.ApiGateway(api)
      ),
    });

    new cdk.CfnOutput(this, "Api", { value: "https://" + fullDomain });
  }
}
