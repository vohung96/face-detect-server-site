#!/bin/bash

# Pull code mới
git pull

# Build Docker image
docker build -t face-detect-server .

# Chạy container
docker-compose up -d

echo "✅ Deploy completed!" 