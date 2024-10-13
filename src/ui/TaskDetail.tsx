import { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dayjs from 'dayjs';

interface Task {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  plannedCompletion: string;
  actualCompletion?: string;
  status: string;
  overdueTime?: string;
  userId: number;
}

interface MonthlyStats {
  total: number;
  completed: number;
  incomplete: number;
}

interface TodayTasks {
  todayTasks: Task[];
  overdueTasks: Task[];
}

export default function TaskDetailList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/users/1/tasks');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        setError(error as Error);
      }
    }

    fetchTasks();
  }, []);

  const getMonthlyStats = (tasks: Task[]): MonthlyStats => {
    const currentMonth = dayjs().month();
    const monthlyTasks = tasks.filter(task => dayjs(task.createdAt).month() === currentMonth);
    const completedTasks = monthlyTasks.filter(task => task.status === 'completed');
    const incompleteTasks = monthlyTasks.filter(task => task.status !== 'completed');

    return {
      total: monthlyTasks.length,
      completed: completedTasks.length,
      incomplete: incompleteTasks.length,
    };
  };

  const getTodayTasks = (tasks: Task[]): TodayTasks => {
    const today = dayjs().startOf('day');
    const todayTasks = tasks.filter(task => dayjs(task.plannedCompletion).isSame(today, 'day'));
    const overdueTasks = tasks.filter(task => task.status !== 'completed' && dayjs(task.plannedCompletion).isBefore(today));

    return {
      todayTasks,
      overdueTasks,
    };
  };

  const getFutureTasks = (tasks: Task[]): Task[] => {
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    return tasks.filter(task => dayjs(task.plannedCompletion).isAfter(tomorrow));
  };

  const monthlyStats = getMonthlyStats(tasks);
  const { todayTasks, overdueTasks } = getTodayTasks(tasks);
  const futureTasks = getFutureTasks(tasks);

  return (
    <div className="hidden md:flex h-full w-full basis-1/5 flex-col border-2 border-gray-200 shadow-md">
      <div className="basis-1/12 flex justify-start items-center px-4">
        <p>任务情况</p>
      </div>
      <Separator />
      <Accordion type="single" defaultValue="item-2" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4">当月任务情况</AccordionTrigger>
          <AccordionContent className="px-4 flex flex-col">
            <div>总任务数: {monthlyStats.total}</div>
            <div>已完成: {monthlyStats.completed}</div>
            <div>未完成: {monthlyStats.incomplete}</div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="px-4">当日完成情况</AccordionTrigger>
          <AccordionContent className="px-4">
            <div>今日任务:</div>
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <div key={task.id}>{task.name}</div>
              ))
            ) : (
              <div>无今日任务</div>
            )}
            <div>超时任务:</div>
            {overdueTasks.length > 0 ? (
              overdueTasks.map((task) => (
                <div key={task.id}>{task.name} (超时 {dayjs().diff(dayjs(task.plannedCompletion), 'day')} 天)</div>
              ))
            ) : (
              <div>无超时任务</div>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="px-4">未完成情况</AccordionTrigger>
          <AccordionContent className="px-4">
            {futureTasks.length > 0 ? (
              futureTasks.map((task) => (
                <div key={task.id}>{task.name}</div>
              ))
            ) : (
              <div>无未来任务</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {error && <div className="text-red-500 px-4">Error: {error.message}</div>}
    </div>
  );
}
