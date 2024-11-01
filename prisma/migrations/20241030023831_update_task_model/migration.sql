/*
  Warnings:

  - The `overdueTime` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
-- 1. 添加一个临时列来存储新的布尔值
ALTER TABLE "Task" ADD COLUMN "status_temp" BOOLEAN;

-- 2. 将现有的字符串状态转换为布尔值并存储在临时列中
UPDATE "Task" SET "status_temp" = CASE WHEN "status" = 'completed' THEN TRUE ELSE FALSE END;

-- 3. 删除旧的字符串状态列
ALTER TABLE "Task" DROP COLUMN "status";

-- 4. 重命名临时列为新的布尔状态列
ALTER TABLE "Task" RENAME COLUMN "status_temp" TO "status";
ALTER TABLE "Task" ALTER COLUMN "content" DROP NOT NULL,
-- DROP COLUMN "status",
-- ADD COLUMN     "status" BOOLEAN NOT NULL,
DROP COLUMN "overdueTime",
ADD COLUMN     "overdueTime" INTEGER;
