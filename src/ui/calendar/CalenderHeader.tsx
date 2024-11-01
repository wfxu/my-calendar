
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { useAtom } from "jotai"
import { yearAtom, monthAtom } from "@/lib/atom"

export default function CalenderHeader() {
    const [year, setYear] = useAtom(yearAtom)
    const [month, setMonth] = useAtom(monthAtom)
    const today = new Date()

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

    return (
        <div className="basis-1/12 flex flex-row items-center justify-center space-x-8">
        <Button variant="secondary" onClick={handleToday}>
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
    )
}