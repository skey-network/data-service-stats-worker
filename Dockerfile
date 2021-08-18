FROM node:14.15.0-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

ADD . .

RUN npm run build

ENTRYPOINT [ "node", "dist/src/main" ]
