# API GEO

## Container

### Dockerfile Linter
https://github.com/hadolint/hadolint
docker run --rm -i hadolint/hadolint < infra/function/Dockerfile

### Docker Build
docker build -t geo-function -f infra/function/Dockerfile .

### Docker Run
docker run -p 3000:8080 --env-file .env geo-function:latest

### Docker Clean
docker rmi $(docker images -f "dangling=true" -q)

## Pulumi
pulumi login s3://auna-pulumi/geo-function
pulumi login s3://auna-pulumi/geo-api

## Set Region
pulumi config set aws:region us-east-1 --cwd infra/function
pulumi config set aws:region us-east-1 --cwd infra/api

## Stacks
pulumi stack init develop --cwd infra/function
pulumi stack init develop --cwd infra/api

## Preview
pulumi preview --cwd infra/function
pulumi preview --cwd infra/api

## Deploy
pulumi up --yes --cwd infra/function
pulumi up --yes --cwd infra/api

## Destroy
pulumi destroy --cwd infra/function
pulumi destroy --cwd infra/api
