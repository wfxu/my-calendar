import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAtom } from "jotai";
import { yearAtom, monthAtom, freshAtom } from "@/lib/atom";
import { useState, useEffect, useMemo } from "react";
import { CardWithForm } from "@/ui/calendar/TaskFormSubmit";
import { Task } from "@/lib/definitions";
import { TaskItem } from "@/ui/calendar/TaskItem";

function calCalendarDays(year: number, month: number) {
    const calenderDayList: Date[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    // Add days from the previous month
    for (let i = firstDayOMonth - 1; i >= 0; i--) {
        const prevMonthDate = new Date(year, month - 1, daysInPrevMonth - i);
        calenderDayList.push(prevMonthDate);
    }
    // Add days from the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        calenderDayList.push(currentDate);
    }
    // Add days from the next month
    for (let i = lastDayOfMonth + 1; i <= 6; i++) {
        const nextMonthDate = new Date(year, month + 1, i - lastDayOfMonth);
        calenderDayList.push(nextMonthDate);
    }

    return calenderDayList;
}

export default function CalenderBody() {
    const [year] = useAtom(yearAtom);
    const [month] = useAtom(monthAtom);
    const [fresh] = useAtom(freshAtom);

    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const calenderDayList = useMemo(() => calCalendarDays(year, month), [year, month]);
    const weekLength = Math.floor(calenderDayList.length / 7);
    const weekNames: string[] = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    const [tasks, setTasks] = useState<Task[]>([]);
    const firstDay = calenderDayList[0];
    const lastDay = calenderDayList[calenderDayList.length - 1];
    const filterBy = 'plannedCompletion'; // 你可以根据需要更改为 'createdAt', 'plannedCompletion', 'actualCompletion', 'status', 'overdueTime'
    useEffect(() => {
        async function fetchTasks() {
            const queryParams = new URLSearchParams({
                start: firstDay.toLocaleDateString(),
                end: lastDay.toLocaleDateString() + ' 23:59:59',
                filterBy,
            });

            const response = await fetch(`/api/tasks?${queryParams.toString()}`);
            const data = await response.json();
            setTasks(data);
        }

        fetchTasks();
    }, [firstDay, lastDay, fresh]);

    const [popoverStates, setPopoverStates] = useState(Array(calenderDayList.length).fill(false));
    const [remainingTasksPopoverStates, setRemainingTasksPopoverStates] = useState(Array(calenderDayList.length).fill(false));

    function handlePopoverChange(index: number, isOpen: boolean, taskid: number | null = null) {
        setSelectedTaskId(taskid);
        setPopoverStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = isOpen;
            return newStates;
        });
    }

    function handleRemainingTasksPopoverChange(index: number, isOpen: boolean) {
        setRemainingTasksPopoverStates(prevStatesRemaining => {
            const newStatesRemaining = [...prevStatesRemaining];
            newStatesRemaining[index] = isOpen;
            return newStatesRemaining;
        });
    }

    return (
        <div className={`grid w-full grow grid-cols-7 grid-rows-${weekLength} justify-items-center`}>
            {calenderDayList.map((day, index) => {
                const dayTasks = tasks.filter(task => {
                    const plannedCompletion = new Date(task.plannedCompletion).toDateString();
                    const actualCompletion = task.actualCompletion ? new Date(task.actualCompletion).toDateString() : null;
                    const dayString = day.toDateString();
                    return (!task.isCompleted && plannedCompletion === dayString) || (task.isCompleted && actualCompletion === dayString);
                });
                const sortedDayTasks = dayTasks.sort((a, b) => {
                    if (a.isCompleted === b.isCompleted) {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    }
                    return a.isCompleted ? 1 : -1;
                });
                const sliceNumber = 3
                const displayedTasks = sortedDayTasks.slice(0, sliceNumber);
                const remainingTaskCount = sortedDayTasks.length - displayedTasks.length;

                return (
                    <div
                        key={index}
                        className={`flex flex-col w-full border border-gray-200 border-t-0 border-l-0 items-center justify-start ${index < 7 ? 'min-h-[80px]' : 'min-h-[70px]'}`}
                    >
                        <div>
                            {index < 7 
                                ? <p>{weekNames[day.getDay()]}</p> 
                                : ''
                            }
                        </div>
                        <div className="w-full flex flex-col items-center text-xs">
                            <Popover
                                key={day.toLocaleDateString()}
                                open={popoverStates[index]}
                                onOpenChange={(isOpen) => handlePopoverChange(index, isOpen)}
                            >
                                <PopoverTrigger
                                    onClick={() => handlePopoverChange(index, true)}
                                    className="flex items-center justify-center w-full h-full"
                                >
                                    <div
                                        key={index}
                                        className={
                                            `flex items-center justify-center p-1 mt-1
                                            ${day.getTime() === today.getTime() ? 'bg-blue-500 text-white' : ''}
                                            ${day.getDate() === 1 ? 'rounded-full' : 'w-6 h-6 rounded-full'}`
                                        }
                                    >
                                        <p className={`text-sm`}>
                                            {day.getDate() === 1 ? `${day.getMonth() + 1}月${day.getDate()}日` : `${day.getDate()}`}
                                        </p>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 border-none shadow-none bg-transparent">
                                    <CardWithForm taskId={selectedTaskId} date={day} onClose={() => handlePopoverChange(index, false)} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col flex-1 w-full items-center text-xs">
                            <div className="flex flex-col w-full h-4/6 items-center">
                                {
                                    displayedTasks.map((task, index) => (
                                        <div className="w-5/6 justify-self-center justify-between" key={String(task.id) + String(index)}>
                                            <TaskItem task={task} />
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="flex items-center justify-center w-full h-1/6">
                                {remainingTaskCount > 0 && (
                                    <Popover
                                        key={`remaining-${day.toLocaleDateString()}`}
                                        open={remainingTasksPopoverStates[index]}
                                        onOpenChange={(isOpen) => handleRemainingTasksPopoverChange(index, isOpen)}
                                    >
                                        <PopoverTrigger className="flex text-xs text-gray-500">
                                            <div className="flex items-center justify-center w-full h-full">
                                                还有 {remainingTaskCount} 个任务
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="rounded-lg">
                                            <div className="flex flex-col w-full space-y-1 items-center">
                                                {sortedDayTasks.slice(sliceNumber).map((task, idx) => (
                                                    <div className="flex w-5/6" key={String(task.id) + String(idx)}>
                                                        <TaskItem task={task} />
                                                    </div>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
