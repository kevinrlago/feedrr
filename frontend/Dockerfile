# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY frontend/ .

# Build application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]