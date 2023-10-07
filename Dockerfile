FROM node:18

WORKDIR /app

ADD . /app

CMD npm install && node app.js