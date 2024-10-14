'use client'
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CardWithForm } from "@/ui/AddNew"
import TaskDetailList from "@/ui/TaskDetail"

function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Shanghai'
  }).replace(/\//g, '-');
}

function Detail({isFirst, dateString, onFresh}: {isFirst: boolean, dateString: string, onFresh: () => void}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const date = new Date(dateString)
  const month: number = date.getMonth() + 1
  const day: number = date.getDate()
  const weekDay: number = date.getDay()
  const weekNames: string[] = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const dateDispaly: string = day == 1 ? `${month}月${day}日` : `${day}`
  const isToday: boolean = dateString === formatDate(new Date())
  return (
    <div className={`flex flex-col w-full border border-gray-200 border-t-0 border-l-0 ${isToday ? 'bg-gray-200' : ''}`}> 
      <Popover key={dateString} open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger className="flex flex-col w-full h-full items-center justify-start " onClick={() => setIsPopoverOpen(true)}>
          {isFirst ? <p className="pb-2">{weekNames[weekDay]}</p> : ''}
          <p className="text-sm">{dateDispaly}</p>
        </PopoverTrigger>
        <PopoverContent className="p-0 border-none shadow-none bg-transparent">
          <CardWithForm dateString={dateString} onClose={() => setIsPopoverOpen(false)} onFresh={onFresh}/>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Page() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

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

  const handleToday = () => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  const calenderDayList: string[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOMonth = new Date(year, month, 1).getDay();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  // Add days from the previous month
  for (let i = firstDayOMonth - 1; i >= 0; i--) {
      const prevMonthDate = new Date(year, month - 1, daysInPrevMonth - i);
      calenderDayList.push(formatDate(prevMonthDate));
  }
  // Add days from the current month
  for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      calenderDayList.push(formatDate(currentDate));
  }
  // Add days from the next month
  for (let i = lastDayOfMonth + 1; i <= 6; i++) {
    const nextMonthDate = new Date(year, month +1, i-lastDayOfMonth)
    calenderDayList.push(formatDate(nextMonthDate))
  }

  const weekLength = Math.floor(calenderDayList.length / 7)

  const [fresh, setFresh] = useState(false)

  useEffect(() => {
    setFresh(true)
  }, [fresh])

  return (
    <div className="flex h-screen items-center justify-center p-10">
      <div className="flex h-full w-full flex-row space-x-4 p-4">
        <div className="flex h-full w-full md:basis-4/5 basis-full flex-col border-2 border-gray-200">
          <div className="basis-1/12 flex flex-row items-center justify-center space-x-8">
            <Button variant="secondary"onClick={handleToday}>
              今天
            </Button>
            <Button variant="ghost" size="icon" title="上个月" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center justify-center">
              <p className="text-base">{year}年{month + 1}月</p>
            </div>
              <Button variant="ghost" size="icon" title="下个月" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
          </div>
          <div className="border border-gray-200"></div>
          <div className={`grid w-full grow grid-cols-7 grid-rows-${weekLength} justify-items-center`}>
            {calenderDayList.map((day, index) =>
              <Detail key={index} isFirst={index < 7} dateString={day} onFresh={() => setFresh(!fresh)}/> 
            )}
          </div>
        </div>
        <TaskDetailList Fresh={fresh}/>
      </div>
    </div>

  )
}