-- CreateTable
CREATE TABLE "KYC" (
    "id" TEXT NOT NULL,
    "aadharId" TEXT NOT NULL,
    "panId" TEXT NOT NULL,
    "driversLicenseId" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "KYC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KYC_aadharId_key" ON "KYC"("aadharId");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_panId_key" ON "KYC"("panId");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_driversLicenseId_key" ON "KYC"("driversLicenseId");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_passport_key" ON "KYC"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_userId_key" ON "KYC"("userId");

-- AddForeignKey
ALTER TABLE "KYC" ADD CONSTRAINT "KYC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
