# Deploying TaxAdviser on Replit

This document provides step-by-step instructions for deploying the TaxAdviser application on Replit with PostgreSQL integration.

## Prerequisites

1. A Replit account
2. Basic knowledge of Git, JavaScript, and databases
3. Firebase account (if using Firebase Storage)

## Step 1: Create a New Replit

1. Log in to your Replit account
2. Create a new Replit by clicking "Create Repl" button
3. Choose "Import from GitHub" option
4. Enter the GitHub repository URL and click "Import from GitHub"
5. Wait for the import process to complete

## Step 2: Configure Environment Variables

Set up your environment variables in the Replit Secrets panel:

1. Click on the lock icon on the left sidebar to open Secrets
2. Add the following variables:
   - `POSTGRES_PASSWORD`: Password for PostgreSQL (default is "postgres")
   - `JWT_SECRET`: A secure random string for JWT token signing
   - Firebase credentials (if using Firebase):
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

## Step 3: Run the Deployment Script

1. Open the Shell in Replit
2. Make the setup script executable:
   ```bash
   chmod +x replit-setup.sh
   ```
3. Run the setup script:
   ```bash
   ./replit-setup.sh
   ```

The script will:
- Initialize the PostgreSQL database
- Install dependencies for both backend and frontend
- Run Prisma migrations
- Build the application
- Start the server

## Step 4: Update Configuration with Replit URL

After deployment:

1. Get your Replit URL from the address bar or the "Webview" tab
2. Update the following files with your Replit URL:
   - `.env` - Update `FRONTEND_URL`
   - `frontend/.env` - Update `VITE_API_URL`

## Step 5: Connect to PostgreSQL Database

To connect to your PostgreSQL database:

1. Open the Shell in Replit
2. Run:
   ```bash
   psql -U postgres -d taxadviser
   ```
3. Enter the password you configured (default is "postgres")

Useful PostgreSQL commands:
- `\dt` - List all tables
- `\d tablename` - Describe a table
- `\q` - Quit the PostgreSQL shell

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Check if PostgreSQL is running:
   ```bash
   pg_isready
   ```
2. Restart PostgreSQL if needed:
   ```bash
   pg_ctl restart -D /home/runner/${REPL_SLUG}/postgres -l /home/runner/${REPL_SLUG}/postgresql.log
   ```

### Application Not Starting

If the application doesn't start:

1. Check the logs for errors:
   ```bash
   tail -f /home/runner/${REPL_SLUG}/postgresql.log
   ```
2. Verify the environment variables are set correctly
3. Run the backend manually:
   ```bash
   cd backend && npm run start:prod
   ```

## Maintenance

### Updating the Application

To update the application:

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```
2. Run the setup script again:
   ```bash
   ./replit-setup.sh
   ```

### Database Migrations

To run database migrations:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Best Practices

1. Regularly backup your database
2. Keep environment variables secure
3. Update dependencies regularly
4. Monitor application performance and logs
5. Set up proper error handling and notifications

---

For additional help, refer to:
- [Replit Documentation](https://docs.replit.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/) 