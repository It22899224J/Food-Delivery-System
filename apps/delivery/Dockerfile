# Step 1: Use official Node.js image as the base
FROM node:18 AS build

# Step 2: Set working directory inside container
WORKDIR /usr/src/app

# Step 3: Copy Prisma schema first (to leverage Docker caching)
COPY ../../apps/delivery/prisma ./apps/delivery/prisma

# Step 4: Copy package files for installation
COPY package*.json ./
COPY tsconfig*.json ./

# Step 5: Install dependencies
RUN npm install

# Step 6: Copy all source code
COPY . .

# Step 7: Generate Prisma client for delivery service
RUN npx prisma generate --schema=apps/delivery/prisma/schema.prisma

# Step 8: Build the delivery microservice
RUN npm run build:delivery

# Step 9: Expose delivery service port (different from restaurant)
EXPOSE 3002

# Step 10: Start the application
CMD ["npm", "run", "start:delivery:prod"]