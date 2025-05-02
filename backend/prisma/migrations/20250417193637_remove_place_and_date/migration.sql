-- CreateTable
CREATE TABLE "TaxForm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "personalInfo" JSONB,
    "incomeInfo" JSONB,
    "rentalIncome" JSONB,
    "foreignIncome" JSONB,
    "workRelatedExpenses" JSONB,
    "specialExpenses" JSONB,
    "extraordinaryBurdens" JSONB,
    "craftsmenServices" JSONB,
    "businessExpenses" JSONB,
    "signature" JSONB,
    "submittedAt" TIMESTAMP(3),
    "language" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "TaxForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxForm_applicationId_key" ON "TaxForm"("applicationId");
