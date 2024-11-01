import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Separator } from "@/components/ui/separator";
import { freshAtom } from "@/lib/atom";
import { Task } from '@/lib/definitions';
import { TaskItem } from './TaskItem'; // 引入 TaskItem 组件

// types.ts
interface TaskStats {
    total: number;
    completed: number;
    pending: number;
}

interface TaskList {
    tasks: Task[];
    overdue: Task[];
    completed: Task[];
}

export default function CalenderSlide() {
  const [monthlyStats, setMonthlyStats] = useState<TaskStats | null>(null);
  const [dailyStats, setDailyStats] = useState<TaskList | null>(null);
  const [fresh] = useAtom(freshAtom);

  const fetchMonthlyStats = async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = now.toISOString().split('T')[0]; // 当前日期
  
      const response = await fetch(`/api/tasks?filterBy=plannedCompletion&start=${startOfMonth}&end=${endOfMonth}`);
      const tasks: Task[] = await response.json();
      const completed = tasks.filter(task => task.isCompleted).length;
      const pending = tasks.length - completed;
      setMonthlyStats({ total: tasks.length, completed, pending });
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  };

  const fetchDailyStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const start = `${today}T00:00:00`;
      const end = `${today}T23:59:59`;
      const yesterday = new Date(new Date(today).getTime() - 24 * 60 * 60 * 1000);
      const yesterdayDate = yesterday.toISOString().split('T')[0];
      const startBefore = `${yesterdayDate}T00:00:00`;
      // 过滤今天之前未完成的任务
      const response_overdue = await fetch(`/api/tasks?isCompleted=false&filterBy=plannedCompletion&end=${startBefore}`);
      const tasks_overdue: Task[] = await response_overdue.json();
      const overdue = tasks_overdue.sort((a, b) => new Date(b.plannedCompletion!).getTime() - new Date(a.plannedCompletion!).getTime());
      // 过滤今天未完成的任务
      const response = await fetch(`/api/tasks?isCompleted=false&filterBy=plannedCompletion&start=${start}&end=${end}`);
      const tasks: Task[] = await response.json();
      const pending = tasks.sort((a, b) => new Date(a.plannedCompletion!).getTime() - new Date(b.plannedCompletion!).getTime());
      // 过滤今天完成的任务
      const response_completed = await fetch(`/api/tasks?isCompleted=true&filterBy=actualCompletion&start=${start}&end=${end}`);
      const tasks_completed: Task[] = await response_completed.json();
      const completed = tasks_completed.sort((a, b) => new Date(b.actualCompletion!).getTime() - new Date(a.actualCompletion!).getTime());

      setDailyStats({ tasks: pending, overdue, completed });
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyStats();
    fetchDailyStats();
  }, [fresh]);

  return (
    <div className="hidden md:flex h-full w-full basis-1/5 flex-col border-2 border-gray-200 shadow-md">
      <div className="basis-1/12 flex justify-start items-center px-4">
        <p className="text-xl font-semibold">任务情况</p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-2 px-4 py-2">
        <h2 className="font-semibold">当月任务情况</h2>
        {monthlyStats ? (
          <div className="space-y-1">
            <div>总任务数: <span className="font-medium">{monthlyStats.total}</span></div>
            <div>已完成: <span className="font-medium">{monthlyStats.completed}</span></div>
            <div>未完成: <span className="font-medium">{monthlyStats.pending}</span></div>
          </div>
        ) : (
          <div>加载中...</div>
        )}
      </div>
      <Separator />
      <div className="flex flex-col flex-grow felx-shrink overflow-hidden px-4 py-2">
        <h2 className="font-semibold">当日任务情况</h2>
        {dailyStats ? (
          <div className="flex flex-col flex-grow overflow-hidden space-y-2 py-2">
            <div className="flex flex-col flex-grow overflow-hidden">
              <div>今日待完成任务:</div>
              {dailyStats.tasks.length > 0 ? (
                
                <div className="flex-1 text-xs overflow-y-auto w-full pl-2 pr-10 space-y-1">
                  {dailyStats.tasks.map((task) => (
                    <TaskItem
                      task={task}
                      key={task.id}
                    />
                  ))}
                </div>
                ) : 
                <div className='text-xs mt-2 ml-2'>今日任务都完成了</div>
              }
            </div>
            <div className="flex flex-col flex-grow overflow-hidden space-y-2">
              <div>超时任务:</div>
              <div className="flex-1 text-xs overflow-y-auto w-full pl-2 pr-10 space-y-1">
                {dailyStats.overdue.map((task) => (
                  <TaskItem
                    task={task}
                    key={task.id}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col flex-grow overflow-hidden space-y-2">
              <div>已完成任务:</div>
              {dailyStats.completed.length > 0 ? (
                <div className="flex-1 text-xs overflow-y-auto min-h-10 w-full pl-2 pr-10 space-y-1 max-h-40">
                  {dailyStats.completed.map((task) => (
                    <TaskItem
                      task={task}
                      key={task.id}
                    />
                  ))}
                </div>
                ) : <div className='text-xs mt-2 ml-2'>暂无已完成任务</div>
              }
            </div>
          </div>
        ) : (
          <div>加载中...</div>
        )}
      </div>
      <div className='flex flex-1'></div>
    </div>
  );
}
