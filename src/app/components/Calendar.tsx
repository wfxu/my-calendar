import React from 'react';

interface Task {
  id: number;
  title: string;
  date: string;
  completed: boolean;
}

interface CalendarProps {
  tasks: Task[];
}

const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const daysInMonth = new Date(2024, 9, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `2024-09-${i.toString().padStart(2, '0')}`;
      const dayTasks = tasks.filter(task => task.date === date);
      days.push(
        <div key={i} className={`day ${date === today ? 'today' : ''}`}>
          <div className="date">{i}</div>
          <div className="tasks">
            {dayTasks.map(task => (
              <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return <div className="calendar">{renderDays()}</div>;
};

export default Calendar;
