'use client'
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Shanghai'
  }).replace(/\//g, '-');
}

function Detail({isFirst, dateString}: {isFirst: boolean, dateString: string}) {
  const date = new Date(dateString)
  const month: number = date.getMonth() + 1
  const day: number = date.getDate()
  const weekDay: number = date.getDay()
  const weekNames: string[] = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const dateDispaly: string = day == 1 ? `${month}月${day}日` : `${day}`
  return (
    <div className="flex flex-col w-full items-center justify-start border border-gray-200 border-t-0 border-l-0"> 
      {isFirst ? <p className="pb-2">{weekNames[weekDay]}</p> : ''}
      <p className="text-sm">{`${dateDispaly}`}</p>
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

  const calenderDayList: string[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const lastDayOfweek = new Date(year, month, 0).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  // Add days from the previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDate = new Date(year, month - 1, daysInPrevMonth - i);
      calenderDayList.push(formatDate(prevMonthDate));
  }
  // Add days from the current month
  for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      calenderDayList.push(formatDate(currentDate));
  }
  // Add days from the next month
  for (let i = lastDayOfweek + 1; i <= 6; i++) {
    const nextMonthDate = new Date(year, month +1, i-lastDayOfweek)
    calenderDayList.push(formatDate(nextMonthDate))
  }

  return (
    <div className="flex h-screen items-center justify-center p-10">
      <div className="flex h-full w-full flex-row space-x-4 p-4">
        <div className="flex h-full w-full basis-4/5 flex-col border-2 border-gray-200">
          <div className="basis-1/12 flex flex-row items-center justify-center">
            <Button variant="ghost" size="icon" title="上个月" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center justify-center mx-10">
              <p className="text-base">{formatDate(today)}</p>
            </div>
              <Button variant="ghost" size="icon" title="下个月" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
          </div>
          <div className="border border-gray-200"></div>
          <div className="grid w-full grow grid-cols-7 grid-rows-5 justify-items-center">
            {calenderDayList.map((day, index) =>
              <Detail key={index} isFirst={index < 7} dateString={day} /> 
            )}
          </div>
        </div>
        <div className="flex h-full w-full basis-1/5 flex-col border-2 border-gray-200">
          <div className="basis-1/12 flex justify-start items-center px-4">
            <p>任务情况</p>
          </div>
          <Separator/>
          <Accordion type="single" defaultValue="item-2" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-4">当月任务情况</AccordionTrigger>
              <AccordionContent className="px-4">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-4">当日完成情况</AccordionTrigger>
              <AccordionContent className="px-4">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-4">未完成情况</AccordionTrigger>
              <AccordionContent className="px-4">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>

  )
}