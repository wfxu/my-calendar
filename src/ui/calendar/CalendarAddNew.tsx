// import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState, ChangeEvent, FormEvent } from "react"
import { TaskFomr } from "@/lib/definitions"


export function MyForm( {task}: {task?: TaskFomr}) {

  const [formData, setFormData] = useState<TaskFomr>({
    name: task?.name || '',
    createdAt: task?.createdAt || new Date(),
    isCompleted: task?.isCompleted || false,
    content: task?.content || '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // 处理表单提交逻辑
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">任务名称:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="请输入任务名称"
        />
      </div>
      <div>
        <label htmlFor="date">任务日期:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.createdAt.toISOString().split('T')[0]}
          onChange={handleChange}
          placeholder="请选择任务日期"
        />
      </div>
      <div>
        <label htmlFor="status">任务状态:</label>
        <select
          id="status"
          name="status"
          value={formData.isCompleted.toString()}
          onChange={handleChange}
        >
          <option value="">请选择任务状态</option>
          <option value="pending">待处理</option>
          <option value="in-progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>
      <div>
        <label htmlFor="content">任务内容:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="请输入任务内容"
        />
      </div>
      <button type="submit">提交</button>
    </form>
  );
};

export function PopoverDemo({ children }: { children: React.ReactNode}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
            {children}
      </PopoverTrigger>
      <PopoverContent>
        <MyForm />
      </PopoverContent>
    </Popover>
  )
}
