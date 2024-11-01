'use client'
import CalenderHeader from "@/ui/calendar/CalenderHeader"
import CalenderBody from "@/ui/calendar/CalenderBody"
import CalenderSlide from "@/ui/calendar/CalenderSlide"

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center p-10">
      <div className="flex h-full w-full flex-row space-x-4 p-4">
        {/* 日历主体部分 */}
        <div className="flex h-full w-full md:basis-4/5 basis-full flex-col border-2 border-gray-200">
          {/* 日历头部 */}
          <CalenderHeader />
          <div className="border border-gray-200"></div>
          {/* 日历主体 */}
          <CalenderBody />
        </div>
        {/* 日历侧边栏 */}
        <CalenderSlide />
      </div>
    </div>

  )
}