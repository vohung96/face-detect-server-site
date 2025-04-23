FROM node:16-slim

WORKDIR /app

# Cài đặt các dependencies cần thiết cho canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python \
    python-pip \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies và rebuild canvas
RUN npm install && \
    npm rebuild canvas --build-from-source

# Copy source code và models
COPY . .
COPY models /app/models

# Cấp quyền truy cập cho thư mục models
RUN chmod -R 755 /app/models

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"] 