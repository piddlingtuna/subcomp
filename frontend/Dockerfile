# syntax=docker/dockerfile:1
FROM node:alpine as builder
WORKDIR /app
ADD . /app
RUN yarn install --production && \ 
    yarn build --production

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .

COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
