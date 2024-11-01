/*
  Warnings:

  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - Added the required column `isCompleted` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable


-- 1. 添加一个临时列来存储新的布尔值
ALTER TABLE "Task" ADD COLUMN "isCompleted_temp" BOOLEAN;

-- 2. 将现有的字符串状态转换为布尔值并存储在临时列中
UPDATE "Task" SET "isCompleted_temp" = false;

-- 3. 删除旧的字符串状态列
ALTER TABLE "Task" DROP COLUMN "status";

-- 4. 将临时列设置为非空并重命名为新的布尔状态列
ALTER TABLE "Task" ALTER COLUMN "isCompleted_temp" SET NOT NULL;
ALTER TABLE "Task" RENAME COLUMN "isCompleted_temp" TO "isCompleted";