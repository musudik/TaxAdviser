# TaxAdviser
Develop a secure and scalable web application that enables users to submit and validate tax returns with third-party API integrations such as DATEV and Agenta. The app will offer two service tiers:  Basic Package: Users submit tax forms and documents for manual submission.  Premium Package: Includes tax advisor review to optimize tax returns


cd backend; pnpm start:dev
cd frontend; pnpm dev


## POSTGRES:
https://www.strongdm.com/blog/postgres-create-user
CREATE USER tax_adviser_app WITH ENCRYPTED PASSWORD 'tax_adviser';

ALTER USER tax_adviser_app WITH SUPERUSER;

GRANT ALL PRIVILEGES ON DATABASE tax_adviser TO tax_adviser_app;

SELECT * FROM pg_user WHERE usename = 'tax_adviser_app';
