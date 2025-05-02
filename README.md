# Tax Adviser Application

A comprehensive German tax filing application built with React (frontend) and NestJS (backend).

## Deployment with Replit

This project includes configuration for easy deployment on Replit. The setup handles both the frontend and backend services, along with PostgreSQL database configuration.

### Automatic Deployment

When you fork this repository to Replit, the application will automatically:

1. Set up required environment variables
2. Install PostgreSQL and create the necessary database
3. Install dependencies for both frontend and backend
4. Build the applications
5. Start both services on their respective ports

### Services

- **Frontend**: Runs on port 5173 (http://localhost:5173)
- **Backend**: Runs on port 3001 (http://localhost:3001/api)
- **Database**: PostgreSQL running on port 5432

### Manual Deployment

If you need to manually run the deployment script:

```bash
sh ./replit_start.sh
```

## Local Development

To run this application locally outside of Replit:

1. Clone the repository
2. Install PostgreSQL on your local machine
3. Create a database named `taxadviser`
4. Set up environment variables (see .env examples in the script)
5. Install dependencies and start services:

```bash
# For backend
cd backend
npm install
npm run start:dev

# For frontend
cd frontend
npm install
npm run dev
```

## Environment Configuration

The deployment script creates default environment files with common settings. For production deployment, remember to:

1. Update JWT secret keys
2. Change database credentials
3. Configure appropriate API URLs

## Troubleshooting

If you encounter any issues with the deployment:

1. Check PostgreSQL installation and connection
2. Verify port availability (3001 for backend, 5173 for frontend)
3. Review logs in the Replit console
4. Make sure all dependencies are properly installed

# TaxAdviser
Develop a secure and scalable web application that enables users to submit and validate tax returns with third-party API integrations such as DATEV and Agenta. The app will offer two service tiers:  Basic Package: Users submit tax forms and documents for manual submission.  Premium Package: Includes tax advisor review to optimize tax returns

npx prisma generate

cd backend; pnpm start:dev
cd frontend; pnpm dev


## POSTGRES:
https://www.strongdm.com/blog/postgres-create-user
CREATE USER tax_adviser_app WITH ENCRYPTED PASSWORD 'tax_adviser';

ALTER USER tax_adviser_app WITH SUPERUSER;

GRANT ALL PRIVILEGES ON DATABASE tax_adviser TO tax_adviser_app;

SELECT * FROM pg_user WHERE usename = 'tax_adviser_app';
