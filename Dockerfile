FROM node:9

WORKDIR /usr/src/app

ENV PIKSEL_DATABASE_NAME piksel
ENV PIKSEL_DATABASE_HOST couchdb
ENV PIKSEL_DATABASE_PROTOCOL http
ENV PIKSEL_DATABASE_PORT 5984

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]