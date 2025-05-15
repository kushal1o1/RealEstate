FROM node:20.10.0

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy prisma folder before install so schema.prisma is available
COPY prisma ./prisma

# Now run install (runs prisma generate as postinstall)
RUN npm install

# Copy rest of app files
COPY . .

# Install nodemon globally (optional)
RUN npm install -g nodemon

CMD ["nodemon", "--env-file", ".env", "app.js"]
