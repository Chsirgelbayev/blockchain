FROM node:alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

EXPOSE 3001 9001

COPY . /usr/src/app

ENTRYPOINT npm run start
