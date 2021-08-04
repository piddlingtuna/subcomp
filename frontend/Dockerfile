# syntax=docker/dockerfile:1
FROM node:latest
WORKDIR /frontend
COPY . .
RUN yarn install --production
RUN yarn build --production
CMD yarn serve -s build
