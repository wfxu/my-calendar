import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CardWithForm( {dateString, onClose}: {dateString: string, onClose: () => void}) {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    plannedCompletion: dateString,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const userId = 1;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${userId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending', // Assuming status is 'pending' by default
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const result = await response.json();
      console.log('Task created successfully:', result);
      onClose();
      // Optionally, you can add more logic here, like clearing the form or showing a success message
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>创建新任务</CardTitle>
        <CardDescription>创建或添加一个新的任务</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">任务名称</Label>
              <Input id="name" placeholder="Name of your project" value={formData.name} onChange={handleChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="content">任务内容</Label>
              <Textarea id="content" value={formData.content} onChange={handleChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="plannedCompletion">任务日期</Label>
              <Input type="date" id="plannedCompletion" placeholder="Select a date" value={formData.plannedCompletion} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type='button' onClick={onClose}>取消</Button>
          <Button type='submit'>创建</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
