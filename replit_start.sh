#!/bin/bash

echo "========================================"
echo "Tax Adviser Application Deployment Script"
echo "========================================"

# Create .env files if they don't exist
setup_env_files() {
  echo "Setting up environment files..."
  
  # Backend .env
  if [ ! -f "./backend/.env" ]; then
    echo "Creating backend .env file..."
    cat > "./backend/.env" << EOF
# Using secrets for database configuration
DATABASE_URL=$DATABASE_URL
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=$POSTGRES_DB

# Using secret for JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=1d

# Application Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
EOF
  fi

  # Frontend .env
  if [ ! -f "./frontend/.env" ]; then
    echo "Creating frontend .env file..."
    cat > "./frontend/.env" << EOF
  # VITE_API_URL=http://localhost:3001/api
  VITE_API_URL=https://tax-adviser-backend.onrender.com/api
EOF
  fi
}

# Setup PostgreSQL 
setup_postgres() {
  echo "Setting up PostgreSQL..."
  
  # Check if PostgreSQL is installed
  if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Setting up PostgreSQL..."
    
    # Install PostgreSQL in Replit environment
    if command -v apt-get &> /dev/null; then
      sudo apt-get update
      sudo apt-get install -y postgresql postgresql-contrib
    else
      echo "Warning: Package manager not found. Please install PostgreSQL manually."
      return 1
    fi
  fi
  
  # Try to start PostgreSQL service
  if command -v service &> /dev/null; then
    sudo service postgresql start
  elif command -v systemctl &> /dev/null; then
    sudo systemctl start postgresql
  else
    echo "Warning: Could not start PostgreSQL service."
  fi
  
  # Wait for PostgreSQL to start
  echo "Waiting for PostgreSQL to start..."
  sleep 5
  
  # Check if database exists, if not create it
  if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw taxadviser; then
    echo "Database 'taxadviser' already exists."
  else
    echo "Creating database 'taxadviser'..."
    sudo -u postgres psql -c "CREATE DATABASE taxadviser;"
    sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
    echo "Database created successfully!"
  fi
}

# Install and build backend
setup_backend() {
  echo "Setting up backend..."
  cd backend
  
  echo "Installing backend dependencies..."
  npm install
  
  # If there are TypeScript files, install dev dependencies
  if [ -f "./tsconfig.json" ]; then
    echo "Installing TypeScript development dependencies..."
    npm install --save-dev typescript ts-node @types/node @types/express @nestjs/common @nestjs/core @nestjs/config @nestjs/typeorm typeorm pg
  fi
  
  # Build backend if there's a build script
  if grep -q "\"build\"" "./package.json"; then
    echo "Building backend..."
    npm run build
  fi
  
  cd ..
}

# Install and build frontend
setup_frontend() {
  echo "Setting up frontend..."
  cd frontend
  
  echo "Installing frontend dependencies..."
  npm install
  
  cd ..
}

# Start backend service
start_backend() {
  echo "Starting backend service on port 3001..."
  cd backend
  
  # Check which start script to use
  if grep -q "\"start:dev\"" "./package.json"; then
    npm run start:dev &
  elif grep -q "\"start\"" "./package.json"; then
    npm run start &
  else
    echo "No start script found in package.json, trying to run with node directly..."
    if [ -f "./dist/main.js" ]; then
      node dist/main.js &
    elif [ -f "./src/main.ts" ]; then
      npx ts-node src/main.ts &
    else
      echo "Error: Could not find an entry point to start the backend."
      return 1
    fi
  fi
  
  cd ..
  echo "Backend started! PID: $!"
}

# Start frontend service
start_frontend() {
  if [ "$NODE_ENV" = "production" ]; then
    echo "Building frontend for production..."
    cd frontend
    npm run build
    cd ..
  else
    echo "Starting frontend service on port 5173..."
    cd frontend
    npm run dev &
    cd ..
    echo "Frontend started! PID: $!"
  fi
}

# Main execution
main() {
  echo "Starting deployment process..."
  
  # Setup environment
  setup_env_files
  
  # Try to setup PostgreSQL
  setup_postgres
  
  # Install and build applications
  setup_backend
  setup_frontend
  
  # Start services
  start_backend
  start_frontend
  
  echo "========================================"
  echo "🚀 All services started!"
  echo "📊 Frontend: http://localhost:5173" 
  #echo "🔌 Backend: http://localhost:3001/api"
  echo "🔌 Backend: https://tax-adviser-backend.onrender.com/api"
  echo "========================================"
  
  # Keep script running to maintain services
  wait
}

# Execute main function
main 