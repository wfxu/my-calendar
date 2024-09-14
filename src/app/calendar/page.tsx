'use client'

import CalendarLayout from '@/ui/calendar/CalendarLayout'
import { PopoverDemo } from '@/ui/calendar/CalendarAddNew';
import { getTodayCompletedTasks, getMonthCompletedTasks, getUncompletedTasks, getPendingTasks } from '@/lib/data'
import { TaskList } from '@/ui/calendar/CalendarList';

export default function Page() {
    return (
        <>
            <CalendarLayout />
            <div className='w-1/5 h-full border border-gray-200 flex flex-col space-y-6 mx-4'>
                <div className="h-10 items-center justify-center m-4">
                    <p>任务列表</p>
                    <div className="border-t-2 border-gray-100 mt-1 w-2/5"></div>
                    <PopoverDemo />
                </div>
                <div className="border-t-2 border-gray-100 mx-1"></div>
                <div className="items-start justify-center m-4 space-y-2">
                    <p>今日已完成（{getTodayCompletedTasks().length}件）</p>
                    <p>当月已完成（{getMonthCompletedTasks().length}件）</p>
                </div>
                <div className="border-t-2 border-gray-100 mx-1"></div>
                <div className="items-start justify-center m-4">
                    <p className="my-4">未完成（{getUncompletedTasks().length}件）</p>
                    <TaskList tasks={getUncompletedTasks()} />
                </div>
                <div className="border-t-2 border-gray-100 mx-1"></div>
                <div className="items-start justify-center m-4">
                    <p className="my-4">待完成（{getPendingTasks().length}件）</p>
                    <TaskList tasks={getPendingTasks()} />
                </div>
            </div>
        </>
    )
}