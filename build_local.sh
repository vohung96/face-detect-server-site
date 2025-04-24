#!/bin/bash

# Cài đặt dependencies
npm install

# Commit và push code lên git
git add .
git commit -m "Update code with dependencies"
git push

echo "✅ Push completed!"
echo "🚀 On server run:"
echo "git pull && docker-compose up -d" 