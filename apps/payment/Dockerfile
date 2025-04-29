# Step 1: Use official Node.js image
FROM node:18 AS build

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy everything inside the build context
COPY . .

# Step 4: Install dependencies
RUN npm install

# Step 5: Generate Prisma client
RUN npx prisma generate --schema=apps/payment/prisma/schema.prisma

# Step 6: Build the payment service
RUN npm run build:payment

# Step 7: Expose port
EXPOSE 3006

# Step 8: Start payment service with migration
CMD ["/bin/sh", "-c", "npx prisma migrate deploy --schema=apps/payment/prisma/schema.prisma && npm run start:payment:prod"]
