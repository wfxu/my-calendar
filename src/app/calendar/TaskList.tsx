import React from 'react';

interface Task {
  id: number;
  title: string;
  date: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className="task-list">
      <h2>Completed Tasks</h2>
      <ul>
        {completedTasks.map(task => (
          <li key={task.id}>{task.title} (Due: {task.date})</li>
        ))}
      </ul>
      <h2>Incomplete Tasks</h2>
      <ul>
        {incompleteTasks.map(task => (
          <li key={task.id}>{task.title} (Due: {task.date})</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
