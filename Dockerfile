# syntax=docker/dockerfile:1

FROM node:18-alpine AS base

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]
