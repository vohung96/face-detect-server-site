#!/bin/bash

# Build Docker image
docker build -t face-detect-server .

echo "Build completed! Docker image face-detect-server is ready."
echo "Push to git and on server run:"
echo "git pull"
echo "docker-compose up -d" 