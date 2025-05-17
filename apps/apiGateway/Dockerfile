FROM node:18 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy only the API Gateway app files
COPY apps/apiGateway ./apps/apiGateway

# Install only the dependencies needed for API Gateway
# This avoids running Prisma operations for other services
RUN npm install

# Build the API Gateway
RUN npm run build:apiGateway

# Expose port
EXPOSE 3025

# Start API Gateway
CMD ["node", "dist/apps/apiGateway/main"]
