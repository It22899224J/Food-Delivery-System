FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy application code
COPY . .

# Install build dependencies for bcrypt
RUN npm install 
# Generate Prisma Client
RUN npx prisma generate --schema=apps/auth/prisma/schema.prisma

# Build the application
RUN npm run build:auth

EXPOSE 3006

CMD ["/bin/sh", "-c", "npx prisma migrate deploy --schema=apps/auth/prisma/schema.prisma && npm run start:auth:prod"]