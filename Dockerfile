FROM node:16.20.2-alpine3.18

# Cài đặt các dependencies cần thiết
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev

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