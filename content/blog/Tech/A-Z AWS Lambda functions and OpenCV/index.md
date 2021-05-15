---
title: A-Z AWS Lambda functions and OpenCV 
author: Deepak
tags: [tech, framework, installation]
date: "2021-02-07"
thumbnail: ./images/diamond.jpg
description: Setting up an AWS lambda function and run an image processing operation.
---
## What is an AWS Lambda function?
AWS lambda is a service offered under [AWS free tier](https://aws.amazon.com/free) that can be used to run a backend service without explicitly allocating or managing servers. Basically a function can be defined in one of the [supported languages](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) along with the dependencies and infrastructure maintenance, scaling, resource allocation and logging will be taken care of by the AWS service. Currently, AWS free tier allows upto _1 Million_ requests per month.

The procedure to setup an image processing operation has been documented here. The lambda function has been written in **Python 3.7** and the image processing library used is **OpenCV 4.3**.

## Creating Account, user and admin groups
An AWS account was created along with a root user, normal user and an admin group for a secure structure.
The [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) details everything.

> As a best practice, do not use the AWS account root user for any task where it's not required. Instead, create a new IAM user for each person that requires administrator access.

### Generating access keys
To setup a local development environment, access keys need to be generated. The [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds) was followed for this step.

> The only time that you can view or download the secret access key is when you create the keys. You cannot recover them later. However, you can create new access keys at any time.

## Creating S3 Bucket
Amazon Simple Storage Service (Amazon S3) is a storage service which can be integrated beautifully across other AWS services. An AWS bucket can be used to take images as an input trigger as well as update lambda functions from local environment. Currently AWS S3 offers 5 GB of storage for 12 months under its free tier services.

An S3 bucket was created by following the [documentation](https://docs.aws.amazon.com/quickstarts/latest/s3backup/welcome.html).

## Creating EC2
Amazon Elastic Compute Cloud (Amazon EC2) allows one to spin up virtual machines at ease. It is germane to install all the dependencies on Amazon Linux and create the lambda function. Hence EC2 is mentioned here. Currently AWS S3 offers 5 GB of storage for 12 months under its free tier services.

A `t2.micro` EC2 instance running on Amazon Linux was created following the steps mentioned in the [EC2 documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance). 

> Don't select Proceed without a key pair. If you launch your instance without a key pair, then you can't connect to it.

The `.pem` file can be used to ssh into or copy files to and from the ec2 instance. The default user name of the instance is **ec2-user**. The public IP of the instance is displayed on the EC2 dashboard. 

The EC2 instance can be logged in by 
```bash
ssh -i ~/path/to/key/<sample_pair>.pem ec2-user@<public_ip>
```

## Creating a lambda function
A Lambda function was created from the [AWS Lambda](https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/functions) dashboard specifying the Python environment. Detailed description can be found [here](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html).

We are offered with a flow of the function starting from a trigger point to the main function followed by its output. We are also provided a web editor which supports a function size of upto 3 MB. Beyond that limit, the functions have to be uploaded as a zip along with the dependencies. Zip files of size upto 50 MB can be uploaded directly using the dashboard or AWS CLI. Libraries like OpenCV cross beyond 50 MB mark and we upload the function using AWS S3. 

The targeted workflow is to develop code in local environment and use an EC2 instance to install and zip all dependencies(_a one-time operation_). Next, the zip would be uploaded to AWS S3 from where the lambda function will be imported.

#### Errors and troubleshooting
1. Ensure the following trust policy in case you get errors due to limited execution role
   ```json
   {
      "Version": "2012-10-17",
      "Statement": 
      [
         {
            "Effect": "Allow",
            "Principal": 
         {
               "Service": 
            [
                  "lambda.amazonaws.com",
               ]
            },
            "Action": "sts:AssumeRole"
         }
      ]
   }
   ```

2. In case the lambda_function could not be found during the import step, ensure that the handler info, mentioned in the Lambda dashboard is `<file_name>.<main_function>`. For instance, if the entry point is `lambda_handler` defined in `lambda_function.py`, the handler info will be `lambda_function.lambda_handler`

## Setting up local environment
### Download and install
The [linux documenation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html#cliv2-linux-install) was followed to install AWS CLI on the local machine. Detailed documentation for all platforms can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

##### Installation instructions
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

##### Configuring the local environment
The Access keys generated while creating the IAM user would be used for the AWS configuration. In the event of missing access keys, new ones can be generated by following the [documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey).

```bash
aws configure
```

Detailed instructions have been documented [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

## Setting up numpy and opencv
All the dependencies were done on the EC2 instance and there were copied to the local machine from where the lambda function can be updated.

A sample function is created that loads an image from the S3 bucket and returns the image dimensions.
```python
import json
import os
import boto3
import cv2
import numpy as np
import io


s3 = boto3.resource("s3")

def image_from_s3(bucket, key, bnw_bucket):
   bucket = s3.Bucket(bucket)
   # Read object from source bucket
   img = bucket.Object(key).get().get("Body").read()
   # Parse object as an image
   img_arr = cv2.imdecode(np.asarray(bytearray(img)), cv2.IMREAD_COLOR)

   bnw_bucket = s3.Bucket(bnw_bucket)
   path_test = "/tmp/output"  # temp path in lambda.
   new_key = "bnw-" + key  # assign filename to 'key' variable
   # Convert colored image to B&W
   bnw_img = cv2.cvtColor(img_arr, cv2.COLOR_BGR2GRAY)

   # Write image to destination bucket
   with open(path_test, "wb") as data:
      data.write(bnw_img)
      bucket.upload_file(path_test, new_key)

   return {"status": "True", "statusCode": 200, "body": "Image Converted"}

# Entry point of the lambda function
def lambda_handler(event, context):
    image_bucket = "source-bucket-name"
    image_key = "source-image.jpg"
    bnw_bucket = "dest-bucket-name"
    return image_from_s3(image_bucket, image_key, bnw_bucket)

```

1. ssh into EC2 instance
   ```bash
   ssh -i ~/path/to/key/<sample_pair>.pem ec2-user@<public_ip>
   ```
2. Perform the installations
   ```python
   yum install python3 zip -y
   mkdir packages
   echo "opencv-python" >> ./requirements.txt
   python3.7 -m pip install --upgrade pip
   pip install -r ./requirements.txt -t ./packages/
   ```
   Zip the dependencies and copy them down to local machine.
   ```bash
   zip -r packages.zip packages/*
   ```

   ```bash
   # Local bash
   # Copy files to local machine from ec2
   scp -i ~/.ssh/sample_pair.pem ec2-user@<ec2_ip>:/home/ec2-user/packages.zip .

   # Add lambda function into the zip
   zip -g packages.zip lambda_function.py

   # If the zip doesn't exceed 50 MB, update the function directly
   aws lambda update-function-code --function-name sample_function.py --zip-file fileb://packages.zip
   
   # Copy the zip to S3 and import from there, in case the zip exceeds 50 MB
   aws s3 cp packages.zip s3://<sample_bucket>/
   # Update the lambda function
   aws lambda update-function-code --function-name sample_function.py --s3-bucket sample_bucket --s3-key packages.zip
   ```

Once the function is updated, the function can be triggered from the Lambda dashboard or CLI manually or by setting up a trigger.

NOTE : After adding a trigger, be careful not to write the image into the same bucket. This will cause a cyclic trigger and will result in endless lambda function calls and S3 storage will fill up.

I would like to thank [Big Endian Data](https://www.bigendiandata.com/2019-04-15-OpenCV_AWS_Lambda/) for helping me understand the flow and present a simplified procedure here.
