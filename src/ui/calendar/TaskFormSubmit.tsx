import { useState, useEffect, useRef, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"

import { useAtom } from 'jotai';
import { freshAtom } from "@/lib/atom"

interface FormData {
    name?: string;
    content?: string;
    plannedCompletion?: string;
    isCompleted?: boolean;
    actualCompletion?: string;
}

const userId = 1;

async function updateTask(taskId: number, formData: FormData) {
    const url = `/api/tasks/${taskId}?userId=${userId}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return response.json();
}

async function createTask(formData: FormData) {
    const url = `/api/tasks?userId=${userId}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    return response.json();
}

export function CardWithForm({ taskId, date, onClose }: { taskId: number | null, date: Date, onClose: () => void }) {
    const [formData, setFormData] = useState<FormData>({
        plannedCompletion: date.toLocaleDateString('en-CA'),
        isCompleted: false
    });
    const [fresh, setFresh] = useAtom(freshAtom);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const prevTaskIdRef = useRef<number | null>(null);
    const prevIsCompletedRef = useRef<boolean>(false);

    useEffect(() => {
        if (taskId && taskId !== prevTaskIdRef.current && !isDataLoaded) {
            // Fetch the task data if taskId is provided and has changed
            const fetchTask = async () => {
                try {
                    const response = await fetch(`/api/tasks/${taskId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch task');
                    }
                    const task = await response.json();
                    setFormData({
                        name: task.name,
                        content: task.content,
                        plannedCompletion: task.plannedCompletion.split('T')[0],
                        isCompleted: task.isCompleted,
                        actualCompletion: task.actualCompletion ? task.actualCompletion.split('T')[0] : undefined
                    });
                    prevIsCompletedRef.current = task.isCompleted;
                    setIsDataLoaded(true);
                } catch (error) {
                    console.error('Error fetching task:', error);
                }
            };
            fetchTask();
            prevTaskIdRef.current = taskId;
        } else if (!taskId) {
            setIsDataLoaded(true);
        }
    }, [taskId, isDataLoaded]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Check if the task is being marked as completed
            if (formData.isCompleted && !prevIsCompletedRef.current) {
                formData.actualCompletion = new Date().toLocaleDateString('en-CA');
            }
            if (taskId) {
                await updateTask(taskId, formData);
            } else {
                await createTask(formData);
            }
            onClose();
            setFresh(!fresh);
        } catch (error) {
            console.error(taskId ? 'Error updating task:' : 'Error creating task:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData,
            [name]: value 
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            isCompleted: checked,
        });
    };

    const handleDelete = async () => {
        if (!taskId) return;

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            console.log('Task deleted successfully');
            onClose();
            setFresh(!fresh);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{taskId ? '编辑任务' : '创建新任务'}</CardTitle>
                <CardDescription>{taskId ? '编辑现有任务' : '创建或添加一个新的任务'}</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">任务名称</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                placeholder="Name of your project" 
                                value={formData.name || ''} 
                                onChange={handleChange} 
                                disabled={!isDataLoaded} 
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="content">任务内容</Label>
                            <Textarea 
                                id="content" 
                                name="content" 
                                value={formData.content || ''} 
                                onChange={handleChange} 
                                disabled={!isDataLoaded} 
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="plannedCompletion">任务日期</Label>
                            <Input 
                                type="date" 
                                id="plannedCompletion" 
                                name="plannedCompletion" 
                                placeholder="Select a date" 
                                value={formData.plannedCompletion} 
                                onChange={handleChange} 
                                disabled={!isDataLoaded} 
                            />
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <Checkbox 
                                id="isCompleted" 
                                name="isCompleted" 
                                checked={formData.isCompleted || false} 
                                onCheckedChange={handleCheckboxChange} 
                                disabled={!isDataLoaded}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                任务{formData.isCompleted ? '已完成' : '未完成'}
                            </label>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type='button' onClick={onClose}>取消</Button>
                    {taskId && (
                        <Button variant="outline" type='button' onClick={handleDelete}>删除</Button>
                    )}
                    <Button type='submit' disabled={!isDataLoaded}>{taskId ? '更新' : '创建'}</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
