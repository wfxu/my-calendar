import { tasks } from '@/lib/mock-data'
import { Task } from '@/lib/definitions';




function getUncompletedTasks(): Task[] {
const today = new Date();
return tasks.filter(task => !task.isCompleted && task.createdAt <= today);
}

function getPendingTasks(): Task[] {
const today = new Date();
return tasks.filter(task => !task.isCompleted && task.createdAt > today);
}

export { getUncompletedTasks, getPendingTasks }