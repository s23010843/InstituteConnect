
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Expose port (Railway and other platforms may set PORT env var)
EXPOSE ${PORT:-8080}

# Start the application
CMD ["npm", "start"]
