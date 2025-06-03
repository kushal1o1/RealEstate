FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm install -g nodemon


CMD ["nodemon", "--env-file", ".env", "app.js"]
