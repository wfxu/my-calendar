import { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dayjs from 'dayjs';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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


function TaskList(
  { 
    tasks,
  }: { 
    tasks: Task[]
  }
) {
 

  return (
    <div>
      {tasks.map((task) => (
        <Popover key={task.id}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {task.name}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Edit Task</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="content">Content</Label>
                    <Input id="content"className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="plannedCompletion">Planned Completion</Label>
                    <Input id="plannedCompletion" type="date"className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" className="col-span-2 h-8" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="destructive">
                    Delete
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

export default function TaskDetailList( {Fresh}: {Fresh: boolean}) {
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
  }, [Fresh]);

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
              <TaskList tasks={todayTasks} />
            <div>超时任务:</div>
              <TaskList tasks={overdueTasks} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="px-4">未完成情况</AccordionTrigger>
          <AccordionContent className="px-4">
            <TaskList tasks={futureTasks} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {error && <div className="text-red-500 px-4">Error: {error.message}</div>}
    </div>
  );
}
