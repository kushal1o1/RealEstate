# Use Node image
FROM node:20.10.0

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
# Install deps & build
RUN npm install

COPY . .




# Start server (usually handled by Nginx in prod)
CMD ["npm", "run","dev"]
