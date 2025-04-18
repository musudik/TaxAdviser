#!/bin/bash

echo "Generating Prisma client..."
npx prisma generate

echo "Creating migration..."
npx prisma migrate dev --name add_tax_form

echo "Migration completed!" 