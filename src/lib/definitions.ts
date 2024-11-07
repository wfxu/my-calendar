import { User as PrismaUser, Task as PrismaTask } from '@prisma/client';

export type User = PrismaUser;
export type Task = PrismaTask;


export interface TaskForm {
    name: string;
    content: string;
    createdAt: Date;
    isCompleted: boolean;
}
