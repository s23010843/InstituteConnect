
#!/bin/bash

# Excellence Institute Setup Script
echo "🎓 Setting up Excellence Institute..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your actual values!"
fi

# Run database migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
    echo "🗃️  Running database migrations..."
    npm run db:push
fi

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Setup complete!"
echo "🚀 Run 'npm start' to start the production server"
echo "🔧 Run 'npm run dev' for development mode"
