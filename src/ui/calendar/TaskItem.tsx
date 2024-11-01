import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CardWithForm } from "@/ui/calendar/TaskFormSubmit";
import { useState } from "react";
import { Task } from '@/lib/definitions';

interface TaskItemProps {
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleTaskItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // Prevent click event from propagating to parent elements
        setPopoverOpen(true);
    };

    return (
        <Popover
            key={task.id}
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
        >
            <PopoverTrigger asChild>
                <div
                    className={`border-t-2 p-1 rounded-lg w-full ${task.isCompleted ? 'bg-amber-200' : 'bg-amber-500'}`}
                    onClick={handleTaskItemClick}
                >
                    <a
                        className={`flex justify-between items-center ${task.isCompleted ? 'line-through' : ''}`}
                    >
                        <span>{task.name}</span>
                        {!task.isCompleted && task.overdueTime && task.overdueTime > 0 && (
                            <span>
                                已超时{task.overdueTime}天
                            </span>
                        )}
                    </a>

                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none shadow-none bg-transparent">
                <CardWithForm taskId={task.id} date={new Date(task.plannedCompletion)} onClose={() => setPopoverOpen(false)} />
            </PopoverContent>
        </Popover>
    );
}
