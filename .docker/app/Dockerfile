FROM node:22.20.0-alpine3.22

RUN apk add --no-cache git
RUN corepack enable

WORKDIR /task/app

CMD ["yarn", "dev", "--host"]
