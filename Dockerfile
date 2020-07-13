FROM node:14.5.0-stretch

USER root

WORKDIR /usr/src/app

COPY bin bin

RUN chmod +x ./bin/entrypoint

COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .
COPY src/conf/env.json5 src/conf/env.json5

RUN yarn

COPY src src

RUN yarn build

ENTRYPOINT /usr/src/app/bin/entrypoint
