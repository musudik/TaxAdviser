-- AlterTable
ALTER TABLE "TaxForm" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "submissionYear" TEXT,
ADD COLUMN     "taxYear" JSONB;
