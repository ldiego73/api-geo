# --------------------------------------------------
# The build image
# --------------------------------------------------

FROM node:alpine as build

# hadolint ignore=DL3018
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python3

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN ls -la
RUN yarn install
RUN yarn build:function

# --------------------------------------------------
# The production image
# --------------------------------------------------

FROM public.ecr.aws/lambda/nodejs:12

ARG FUNCTION_DIR="/var/task"
ENV NODE_ENV production

COPY --from=build /usr/src/app/dist ${FUNCTION_DIR}
COPY --from=build /usr/src/app/package.json ${FUNCTION_DIR}

RUN npm i micro-lambda-api
RUN ls -la ${FUNCTION_DIR}

CMD [ "index.handler" ]
