# Step 1: Use official Node.js image as the base
FROM node:18 AS build

# Step 2: Set working directory inside container
WORKDIR /usr/src/app

# Step 3: Copy Prisma schema first (to leverage Docker caching)
COPY ../../apps/restaurant/prisma ./apps/restaurant/prisma

# Step 4: Copy package.json and tsconfig for installation
COPY ../../package*.json ./
COPY ../../tsconfig*.json ./

# Step 5: Install dependencies
RUN npm install

# Step 6: Copy all source code
COPY ../../ .

# Step 7: Generate Prisma client for the correct platform
RUN npx prisma generate --schema=apps/restaurant/prisma/schema.prisma

# Step 8: Build the specific microservice
RUN npm run build:restaurant

# Step 9: Expose the port
EXPOSE 3000

# Step 10: Start the application
CMD ["npm", "run", "start:restaurant:prod"]
