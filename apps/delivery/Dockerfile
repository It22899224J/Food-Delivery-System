# Step 1: Use official Node.js image
FROM node:18 AS build

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy everything inside the build context
COPY . .

# Step 4: Install dependencies
RUN npm install

# Step 5: Generate Prisma client
RUN npx prisma generate --schema=apps/delivery/prisma/schema.prisma

# Step 6: Build the delivery service
RUN npm run build:delivery

# Step 7: Expose port
EXPOSE 3002

# Step 8: Start delivery service
CMD ["/bin/sh", "-c", "npx prisma migrate deploy --schema=apps/delivery/prisma/schema.prisma && npm run start:delivery:prod"]