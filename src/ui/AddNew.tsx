
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


export function CardWithForm( {dateString, onCancel}: {dateString: string, onCancel: () => void}) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>创建新任务</CardTitle>
        <CardDescription>创建或添加一个新的任务</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">任务名称</Label>
                    <Input id="name" placeholder="Name of your project" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">任务内容</Label>
                    <Textarea/>
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="date">任务日期</Label>
                    <Input type="date" id="date" placeholder="Select a date"  value={dateString}/>
                </div>
            </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button>创建</Button>
      </CardFooter>
    </Card>
  )
}
