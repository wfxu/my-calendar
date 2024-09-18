import { Task } from '@/lib/definitions';
import { useState } from 'react';

function TaskShow({ task }: { task: Task }) {
    const today = new Date();
    const createdAt = new Date(task.createdAt);
    const timeDifference = today.getTime() - createdAt.getTime();

    const overdueDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return (
        <div>
        {task.name}
        {!task.isCompleted && overdueDays > 0 && (
            <p className='text-sm text-red-500'>
                （超时 {overdueDays} 天）
            </p>
        )}
        </div>
    );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
    const [taskList, setTaskList] = useState(tasks);
  
    const handleComplete = (id: number) => {
      setTaskList(taskList.map(task => 
        task.id === id ? { ...task, isCompleted: true } : task
      ));
    };
  
    const handleTaskClick = (task: Task) => {
      // Show task details and allow modification
      // This is a placeholder for the actual implementation
      alert(`Task details: ${task.name}`);
    };
  
    return (
      <ul className="space-y-2 overflow-y-auto max-h-40">
        {taskList.map((task) => (
          <li key={task.id} className="flex items-center">
            <button
              onClick={() => handleComplete(task.id)}
              className={`w-4 h-4 rounded-full border-2 ${task.isCompleted ? 'bg-green-500' : 'bg-white'}`}
            ></button>
            <span
              onClick={() => handleTaskClick(task)}
              className="ml-2 cursor-pointer"
            >
              <TaskShow task={task} />
            </span>
          </li>
        ))}
      </ul>
    );
  }