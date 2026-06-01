-- CreateTable
CREATE TABLE "Automation" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "DeviceComponents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
