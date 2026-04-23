FROM node:22.20.0-alpine3.22

RUN apk add --no-cache git
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
    
COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host"]