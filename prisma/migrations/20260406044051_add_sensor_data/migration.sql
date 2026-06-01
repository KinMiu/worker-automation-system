-- CreateTable
CREATE TABLE "SensorData" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "componentId" TEXT,
    "type" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "DeviceComponents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
