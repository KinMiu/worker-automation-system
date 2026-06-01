-- CreateTable
CREATE TABLE "DeviceStatusLog" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "reason" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceStatusLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeviceStatusLog" ADD CONSTRAINT "DeviceStatusLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
