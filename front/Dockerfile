FROM node:14-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock server.js /app/
RUN yarn install --production
COPY . /app
RUN NODE_ENV=production yarn build

CMD node ./server.js
