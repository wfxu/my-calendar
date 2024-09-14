export interface Task {
    id: number;
    name: string;
    content: string;
    createdAt: Date;
    isCompleted: boolean;
    completedAt?: Date;
  }