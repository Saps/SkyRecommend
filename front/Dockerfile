FROM node:14-alpine

COPY . .

RUN npm install --production
CMD NODE_ENV=production npm start --env={env}
