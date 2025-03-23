-- CreateTable
CREATE TABLE "TaxReturn" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "personalInfo" JSONB NOT NULL,
    "children" JSONB,
    "incomeInfo" JSONB NOT NULL,
    "deductions" JSONB NOT NULL,
    "taxCredits" JSONB NOT NULL,
    "signature" JSONB,
    "metadata" JSONB,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "TaxReturn_pkey" PRIMARY KEY ("id")
); 