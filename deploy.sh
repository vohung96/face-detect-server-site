#!/bin/bash

# Pull code mới
git pull

# Xóa container và image cũ
echo "Cleaning up old containers and images..."
docker-compose down
docker rmi face-detect-server || true

# Build Docker image
echo "Building Docker image..."
docker build --no-cache -t face-detect-server .

# Chạy container
echo "Starting containers..."
docker-compose up -d

# Kiểm tra logs
echo "Checking container logs..."
docker logs face-detect-server-site-face-detect-server-1

echo "✅ Deploy completed!" 