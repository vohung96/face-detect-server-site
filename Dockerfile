FROM node:16.20.2-slim

WORKDIR /app

# Kiểm tra phiên bản Node.js
RUN node --version

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Kiểm tra các file quan trọng
RUN ls -la /app && \
    ls -la /app/models/

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.js"] 