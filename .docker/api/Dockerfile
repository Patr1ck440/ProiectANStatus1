FROM node:22.20.0-alpine3.22

WORKDIR /app

RUN apk add --no-cache git
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

COPY package.json ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["node", "api.js"]