'use client';

import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import TaskList from '../calendar/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div className="container">
      <div className="calendar-container">
        <Calendar tasks={tasks} />
      </div>
      <div className="task-list-container">
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
