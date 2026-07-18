.PHONY: setup dev test build lint clean

# Default target when just running 'make'
all: setup dev

# Install all dependencies
setup:
	@echo "📦 Installing dependencies..."
	npm install

# Run the development server
dev:
	@echo "🚀 Starting development server on http://localhost:3000..."
	npm run dev

# Run all tests (optimized for speed)
test:
	@echo "🧪 Running tests..."
	npm run test

# Build for production
build:
	@echo "🏗️ Building for production..."
	npm run build

# Run linter
lint:
	@echo "🧹 Running linter..."
	npm run lint

# Clean build artifacts and node_modules
clean:
	@echo "🗑️ Cleaning up..."
	rm -rf .next
	rm -rf node_modules
	@echo "✨ Clean complete!"
