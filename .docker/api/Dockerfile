FROM node:22.20.0-alpine3.22

RUN apk add --no-cache git
RUN corepack enable yarn

WORKDIR /task/api
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

CMD ["node", "api.js"]