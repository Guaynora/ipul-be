-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('OFFERING', 'TITHE', 'SALE_OTHER');

-- CreateEnum
CREATE TYPE "FundSource" AS ENUM ('TITHE', 'NON_TITHE');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('DRAFT', 'ACTIVE', 'RETIRED');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parishioners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "baptized" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parishioners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_versions" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "DiscountStatus" NOT NULL DEFAULT 'DRAFT',
    "effective_from" TIMESTAMP(3) NOT NULL,
    "rules" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMP(3),

    CONSTRAINT "discount_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incomes" (
    "id" TEXT NOT NULL,
    "type" "IncomeType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "parishioner_id" TEXT,
    "discount_version_id" TEXT,
    "discount_snapshot" JSONB,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "fund_source" "FundSource" NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "discount_versions_version_key" ON "discount_versions"("version");

-- CreateIndex
CREATE INDEX "incomes_type_date_idx" ON "incomes"("type", "date");

-- CreateIndex
CREATE INDEX "incomes_parishioner_id_idx" ON "incomes"("parishioner_id");

-- CreateIndex
CREATE INDEX "expenses_fund_source_date_idx" ON "expenses"("fund_source", "date");

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_parishioner_id_fkey" FOREIGN KEY ("parishioner_id") REFERENCES "parishioners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_discount_version_id_fkey" FOREIGN KEY ("discount_version_id") REFERENCES "discount_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
