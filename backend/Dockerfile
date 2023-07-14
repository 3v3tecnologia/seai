# syntax=docker/dockerfile:1.4

FROM node:18-bullseye-slim  AS development

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

RUN apt-get update && apt-get install -y --no-install-recommends git

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

ADD . .

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT
# HEALTHCHECK --interval=30s \
#     CMD node healthcheck.js
# RUN npm run build

# CMD [ "node","/usr/src/app/src/server.js" ]
CMD [ "npm","dev:watch" ]

