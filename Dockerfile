FROM debian:bullseye-slim

# Cài đặt Node.js 16 và các dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Kiểm tra phiên bản Node.js
RUN node --version

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