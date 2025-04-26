#!/bin/bash

# Pull code mới
git pull

# Xóa container và image cũ
docker-compose down
docker rmi face-detect-server || true

# Build Docker image
echo "Building Docker image..."
docker build -t face-detect-server .

# Chạy container
echo "Starting containers..."
docker-compose up -d

echo "✅ Deploy completed!" 