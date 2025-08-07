import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path'
import { Construct } from 'constructs';

export class GettingStartedWithTheAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pieShopSiteBucket = new s3.Bucket(this, 'PieShopSiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test purposes 
      autoDeleteObjects: true, // Only for dev/test purposes
    });

    pieShopSiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [pieShopSiteBucket.arnForObjects('*')],
      principals: [new iam.AnyPrincipal()],
      effect: iam.Effect.ALLOW,
      sid: 'PublicReadGetObject'
    }));

    new s3deploy.BucketDeployment(this, 'DeployPieShopSite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../site'))],
      destinationBucket: pieShopSiteBucket,
    });
  }
}
