#!/bin/bash

# Initialize the database
echo "Initializing PostgreSQL database..."

# Set up PostgreSQL if not already running
if ! pg_isready; then
  echo "Setting up PostgreSQL database..."
  mkdir -p /home/runner/${REPL_SLUG}/postgres
  initdb -D /home/runner/${REPL_SLUG}/postgres
  
  # Update PostgreSQL configuration
  echo "Configuring PostgreSQL authentication..."
  echo "host all postgres 127.0.0.1/32 trust" >> /home/runner/${REPL_SLUG}/postgres/pg_hba.conf
  
  # Start PostgreSQL
  pg_ctl start -D /home/runner/${REPL_SLUG}/postgres -l /home/runner/${REPL_SLUG}/postgresql.log
  
  # Set password for postgres user
  psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
else
  echo "PostgreSQL is already running."
fi

# Create the database if it doesn't exist
echo "Checking if database exists..."
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'taxadviser'" | grep -q 1
if [ $? -ne 0 ]; then
  echo "Creating taxadviser database..."
  psql -U postgres -c "CREATE DATABASE taxadviser"
else
  echo "Database already exists."
fi

# Install dependencies
echo "Installing backend dependencies..."
cd backend && npm install
echo "Installing frontend dependencies..."
cd ../frontend && npm install
cd ..

# Run Prisma migrations
echo "Running database migrations..."
cd backend
npx prisma migrate deploy
npx prisma generate
cd ..

# Build the project
echo "Building backend..."
cd backend && npm run build
echo "Building frontend..."
cd ../frontend && npm run build
cd ..

# Start the application
echo "Starting the application..."
cd backend && npm run start:prod 