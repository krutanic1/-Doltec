# e:/DOLTEC/re-frontend/Dockerfile

# Step 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Set environment variables for build if necessary
# ENV NEXT_PUBLIC_API_URL=https://api.doltec.com
RUN npm run build

# Step 2: Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
