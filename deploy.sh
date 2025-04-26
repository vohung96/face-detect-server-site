#!/bin/bash

# Pull code mới
git pull

# Xóa container và image cũ
echo "Cleaning up old containers and images..."
sudo docker-compose down
sudo docker rmi face-detect-server || true

# Build Docker image
echo "Building Docker image..."
sudo docker build --no-cache --pull -t face-detect-server .

# Chạy container
echo "Starting containers..."
sudo docker-compose up -d

# Kiểm tra logs
echo "Checking container logs..."
sleep 5
sudo docker logs face-detect-server-site-face-detect-server-1

echo "✅ Deploy completed!" 