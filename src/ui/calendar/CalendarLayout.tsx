import { useState } from "react";

export function generateCalendarDays(year: number, month: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
  
    const weeks = [];
    let currentWeek = [];
  
    // Helper function to format date with timezone consideration
    function formatDate(date: Date) {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Shanghai'
        }).replace(/\//g, '-');
    }
  
    // Add days from the previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevMonthDate = new Date(year, month - 1, daysInPrevMonth - i);
        currentWeek.push({ fullDate: formatDate(prevMonthDate) });
    }
  
    // Add days from the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        currentWeek.push({ fullDate: formatDate(currentDate) });
  
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
  
    // Add days from the next month
    let nextMonthDay = 1;
    while (currentWeek.length < 7 && currentWeek.length > 0) {
        const nextMonthDate = new Date(year, month + 1, nextMonthDay++);
        currentWeek.push({ fullDate: formatDate(nextMonthDate) });
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }
  
    return weeks;
  }

function CalendarRow(
    { daysOfWeek, isFirst = false }: 
    { daysOfWeek: { fullDate: string }[]; isFirst?: boolean }
) {
    const weekName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return (
        <div className="grid grid-cols-7 flex-grow border-b border-gray-200">
            {daysOfWeek.map((day, index) => {
                const date = new Date(day.fullDate).getDate();
                const month = new Date(day.fullDate).getMonth() + 1;
                const isFirstDayOfMonth = date === 1;
                return (
                    <div key={index} className="border border-gray-200 flex flex-col items-center justify-start pt-2">
                        {isFirst ? <p className="pb-2">{weekName[index]}</p> : ''}
                        {isFirstDayOfMonth ? <p className="text-sm">{`${month}月${date}日`}</p> : <p className="text-sm">{`${date}`}</p>}
                        {/* <p>{day.fullDate}</p> */}
                        
                    </div>
                );
            })}
        </div>
    );
}

function CalendarGrid({ year, month }: { year: number, month: number }) {
    const weeks = generateCalendarDays(year, month);
    const gridRowsClass = `grid-rows-${weeks.length}`;
    return (
        <div className={`flex-grow grid ${gridRowsClass} border-collapse border border-gray-200`}>
            {weeks.map((week, index) => (
                <CalendarRow key={index} daysOfWeek={week} isFirst={index === 0} />
            ))}
        </div>
    );
}

export default function CalendarLayout() {
    const [year, setYear] = useState(2024);
    const [month, setMonth] = useState(8);

    const handlePrevMonth = () => {
        if (month === 0) {
            setYear(year - 1);
            setMonth(11);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month + 1);
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="bg-gray-200 flex items-center justify-center gap-10 min-h-10">
                <button onClick={handlePrevMonth}>上一月</button>
                <div className="flex flex-col">
                    <div>{year}年{month + 1}月</div>
                    <div className="text-xs text-gray-600">农历八月~九月</div>
                </div>
                <button onClick={handleNextMonth}>下一月</button>
            </div>
            <CalendarGrid year={year} month={month} />
        </div>
    );
}
