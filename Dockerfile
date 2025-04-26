FROM ubuntu:18.04

# Cài đặt các dependencies cần thiết
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt nvm và Node.js 16
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 16.20.2

RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Kiểm tra phiên bản Node.js
RUN node --version

WORKDIR /app

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