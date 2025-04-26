# Build stage
FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Final stage
FROM node:16-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app .

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.js"] 