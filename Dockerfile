FROM node:9

LABEL mantainer "Luthfi (https://github.com/luthfiswees), Anto (https://github.com/antoooks)"

WORKDIR /usr/src/app

ENV PIKSEL_DATABASE_NAME piksel

ENV PIKSEL_COUCHDB_HOST couchdb
ENV PIKSEL_COUCHDB_PROTOCOL http
ENV PIKSEL_COUCHDB_PORT 5984
ENV PIKSEL_PORT 4500

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

EXPOSE 4500
CMD [ "npm", "start" ]