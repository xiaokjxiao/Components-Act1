/*
  Warnings:

  - You are about to drop the `Magic8BallResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Magic8BallResponse";

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expectedSalary" DOUBLE PRECISION NOT NULL,
    "expectedDateOfDefense" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);
