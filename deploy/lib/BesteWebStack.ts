import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import { CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

interface BesteWebStackProps extends StackProps {
  envName: "prod" | "stage";
  domainName: "bestetipset.se";
  siteSubDomain: "www";
}

export class BesteWebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BesteWebStackProps) {
    super(scope, id, props);

    const zone = cdk.aws_route53.HostedZone.fromLookup(this, "Zone", {
      domainName: props.domainName,
    });
    const fullDomain = props.siteSubDomain + "." + props.domainName;
    const cloudfrontOAI = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: `OAI for ${fullDomain}`,
      }
    );

    new cdk.CfnOutput(this, "Site", { value: "https://" + fullDomain });

    // Content bucket
    const siteBucket = new cdk.aws_s3.Bucket(this, "BesteWebBucket", {
      bucketName: fullDomain,
      publicReadAccess: false,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new cdk.aws_iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // TLS certificate
    const certificate = new cdk.aws_certificatemanager.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: fullDomain,
        region: "us-east-1", // must be us-east-1 for cloudfront, apparently
        hostedZone: zone,
      }
    );
    new cdk.CfnOutput(this, "Certificate", {
      value: certificate.certificateArn,
    });

    // CloudFront distribution
    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      "SiteDistribution",
      {
        certificate: certificate,
        defaultRootObject: "index.html",
        domainNames: [fullDomain],
        minimumProtocolVersion:
          cdk.aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 404,
            responsePagePath: "/404.html",
            ttl: cdk.Duration.minutes(30),
          },
        ],
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(siteBucket, {
            originAccessIdentity: cloudfrontOAI,
          }),
          compress: true,
          allowedMethods:
            cdk.aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      }
    );

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new cdk.aws_route53.ARecord(this, "SiteAliasRecord", {
      recordName: fullDomain,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.CloudFrontTarget(distribution)
      ),
      zone,
    });

    // Deploy site contents to S3 bucket
    new cdk.aws_s3_deployment.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [cdk.aws_s3_deployment.Source.asset("../beste-web/out")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
