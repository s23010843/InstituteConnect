
#!/bin/bash

# Excellence Institute Setup Script
# This script sets up the development environment

echo "🎓 Setting up Excellence Institute..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your actual values."
else
    echo "✅ .env file already exists"
fi

# Run database migrations
echo "🗄️ Setting up database..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "⚠️ Database setup failed. Make sure your DATABASE_URL is correct in .env"
else
    echo "✅ Database setup complete"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:5000 to see your application"
echo ""
