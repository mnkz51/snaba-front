# syntax=docker/dockerfile:1.0-experimental

FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install --no-optional

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist" ]

# END
