FROM node:20.10.0

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm install -g nodemon


CMD ["nodemon", "--env-file", ".env", "app.js"]
