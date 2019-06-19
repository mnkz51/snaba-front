# syntax=docker/dockerfile:1.0-experimental

FROM node:lts-alpine

RUN npm install -g --no-optional browser-sync

WORKDIR /app

COPY bs-config.js /app/bs-config.js
COPY ssl/dev-server.key /etc/ssl/dev-server.key
COPY ssl/dev-server.crt /etc/ssl/dev-server.crt

EXPOSE 13443
EXPOSE 13501

CMD [ "browser-sync", "start", "-c", "bs-config.js" ]

# END
