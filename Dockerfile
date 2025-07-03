
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --omit=dev

# Set production environment
ENV NODE_ENV=production

# Expose port (Railway and other platforms may set PORT env var)
EXPOSE ${PORT:-8080}

# Start the application
CMD ["npm", "start"]
