# ec2-create-ami
create EC2 AMI for existing EC2 instances with Lambda

the AMI image name format: `{EC2_INSTANCE_ID}-{YYYYMMDDhhmm}`



# claudia commands

### create function

```
AWS_PROFRILE=<profile> claudia create --name ec2-create-ami --role=<role> --region <region> --handler main.handler
```

#### update function

```
claudia update
```

#### test function

```
claudia test-lambda
```

