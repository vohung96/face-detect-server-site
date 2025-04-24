FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /app

# Copy toàn bộ source code
COPY . .

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.js"] 