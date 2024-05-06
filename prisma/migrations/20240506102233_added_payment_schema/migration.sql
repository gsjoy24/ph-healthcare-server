-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "appointtmentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "paymentGatewayData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_appointtmentId_key" ON "payments"("appointtmentId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointtmentId_fkey" FOREIGN KEY ("appointtmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
