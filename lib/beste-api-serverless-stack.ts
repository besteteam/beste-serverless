import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

export class BesteApiServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, "GraphqlLambda", {
      runtime: Runtime.NODEJS_18_X,
      //   entry: path.join(__dirname, `/../functions/addUserLambda.ts`),
      entry: path.join(__dirname, `../src/lambda.ts`),
      handler: "handler",
      // environment: {
      //   TABLENAME: userTable.tableName,
      // },
    });

    new LambdaRestApi(this, "GraphqlEndpoint", {
      handler: lambda,
    });

    // const graphqlLambda = new lambda.Function(this, "graphqlLambda", {
    //   // Where our function is located - in that case, in `lambda` directory at the root of our project
    //   code: lambda.Code.fromAsset(path.join(__dirname, "../lambda")),
    //   // What should be executed once the lambda is invoked - in that case, the `handler` function exported by `graphql.ts`
    //   handler: "graphql.handler",
    //   // Our runtime of choice - in that case, node.js 12.x
    //   runtime: lambda.Runtime.NODEJS_12_X,
    // });
  }
}
