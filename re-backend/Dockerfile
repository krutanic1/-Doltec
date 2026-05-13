# e:/DOLTEC/re-backend/Dockerfile

# Step 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and generate Prisma client
COPY . .
RUN npx prisma generate
RUN npm run build

# Step 2: Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files and prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5001

CMD ["npm", "run", "start:prod"]
