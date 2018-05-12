FROM node:9

WORKDIR /es-bot

COPY package*.json /es-bot/

RUN npm install

COPY . /es-bot

CMD npm start