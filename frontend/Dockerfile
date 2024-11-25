# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY frontend/ .

# Install peer dependencies
RUN npm install -g typescript @types/node

# Set environment variables
ENV NODE_ENV=production
ENV CI=false

# Build the app
RUN npm run build

# Use a lightweight server for production
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]