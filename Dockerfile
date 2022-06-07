FROM node:alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ENV	PORT=3000
ENV 	METRICS_PORT=9001
ENV	NODE_ENV=dev
ENV	COMPARATIVE_INTEGER=2
ENV	GENBLOCK_CURRENT_TIME=0
ENV	GENBLOCK_TRANSACTIONS=0
ENV	GENBLOCK_PREVHASH=0

COPY package.json /usr/src/app

RUN npm install

EXPOSE 3000 9001

COPY . /usr/src/app

ENTRYPOINT npm run start