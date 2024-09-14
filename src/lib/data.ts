import { tasks } from '@/lib/mock-data'
import { Task } from '@/lib/definitions';

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
function isSameMonth(date1: Date, date2: Date): boolean {
return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth();
}

function getTodayCompletedTasks(): Task[] {
const today = new Date();
return tasks.filter(task => task.isCompleted && isSameDay(task.completedAt!, today));
}

function getMonthCompletedTasks(): Task[] {
const today = new Date();
return tasks.filter(task => task.isCompleted && isSameMonth(task.completedAt!, today));
}

function getUncompletedTasks(): Task[] {
const today = new Date();
return tasks.filter(task => !task.isCompleted && task.createdAt <= today);
}

function getPendingTasks(): Task[] {
const today = new Date();
return tasks.filter(task => !task.isCompleted && task.createdAt > today);
}

export { getTodayCompletedTasks, getMonthCompletedTasks, getUncompletedTasks, getPendingTasks }