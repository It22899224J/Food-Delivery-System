# Step 1: Use official Node.js image
FROM node:18 AS build

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy only what's needed
COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/restaurant/prisma apps/restaurant/prisma

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app
COPY . .

# Step 6: Generate Prisma client
RUN npx prisma generate --schema=apps/restaurant/prisma/schema.prisma

# Step 7: Build the specific microservice
RUN npm run build:restaurant

# Step 8: Expose app port
EXPOSE 3000

# Step 9: Set environment variable (optional but nice)
ENV PORT=3000

# Step 10: Run the application
CMD ["npm", "run", "start:restaurant:prod"]
