FROM node:20-slim

WORKDIR /app

# Copy toàn bộ source code
COPY . .

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.js"] 