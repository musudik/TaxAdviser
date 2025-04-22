# Tax Adviser Application

A German tax return application built with React, NestJS, and PostgreSQL.

## Deployment on Replit

This project is configured to be easily deployed on Replit with PostgreSQL support.

### Setup Instructions

1. **Create a new Replit**
   - Create a new Replit and choose "Import from GitHub"
   - Enter the repository URL

2. **Environment Variables**
   - Ensure the following secrets are set in your Replit:
     - `POSTGRES_PASSWORD`: Password for PostgreSQL (default is "postgres")
     - `JWT_SECRET`: Secret for JWT tokens
     - Any Firebase-related variables if using Firebase Storage

3. **Run the Application**
   - The application will automatically:
     - Set up PostgreSQL database
     - Install dependencies
     - Run database migrations
     - Build the frontend and backend
     - Start the server

### PostgreSQL Configuration

The application uses PostgreSQL for data storage. The setup script automatically:
- Initializes a PostgreSQL database if not already running
- Creates a database named "taxadviser" if it doesn't exist
- Runs all Prisma migrations

### Customizing the Configuration

To customize the deployment:

1. **Database Configuration**
   - Edit the `DATABASE_URL` in `.replit` and `.env` files

2. **Firebase Configuration (if using)**
   - Update Firebase credentials in the `.env` and `frontend/.env` files

3. **Frontend URL**
   - After deployment, update the `FRONTEND_URL` in `.env` with your Replit URL

## Development

For local development:

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run the backend
cd backend && npm run start:dev

# Run the frontend
cd frontend && npm run dev
```

## Project Structure

- `/backend` - NestJS backend application
- `/frontend` - React frontend application
- `/prisma` - Prisma schema and migrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.


cd backend; pnpm start:dev
cd frontend; pnpm dev


## POSTGRES:
https://www.strongdm.com/blog/postgres-create-user
CREATE USER tax_adviser_app WITH ENCRYPTED PASSWORD 'tax_adviser';

ALTER USER tax_adviser_app WITH SUPERUSER;

GRANT ALL PRIVILEGES ON DATABASE tax_adviser TO tax_adviser_app;

SELECT * FROM pg_user WHERE usename = 'tax_adviser_app';
