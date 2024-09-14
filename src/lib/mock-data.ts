import { Task } from './definitions';

export const tasks: Task[] = [
  // 2024-09-12
  {
    id: 1,
    name: "团队会议",
    content: "参加每周的团队会议，讨论项目进展。",
    createdAt: new Date('2024-09-12T09:00:00'),
    isCompleted: true,
    completedAt: new Date('2024-09-12T11:00:00')
  },
  {
    id: 2,
    name: "客户电话",
    content: "与客户讨论新需求和项目时间表。",
    createdAt: new Date('2024-09-12T14:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  {
    id: 3,
    name: "阅读书籍",
    content: "阅读《程序员修炼之道》至少30分钟。",
    createdAt: new Date('2024-09-12T20:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  // 2024-09-13
  {
    id: 4,
    name: "编写代码",
    content: "完成新功能的代码编写。",
    createdAt: new Date('2024-09-13T10:00:00'),
    isCompleted: true,
    completedAt: new Date('2024-09-13T15:00:00')
  },
  {
    id: 5,
    name: "项目报告",
    content: "撰写项目进展报告并发送给经理。",
    createdAt: new Date('2024-09-13T13:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  {
    id: 6,
    name: "健身",
    content: "去健身房进行1小时的锻炼。",
    createdAt: new Date('2024-09-13T18:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  // 2024-09-14
  {
    id: 7,
    name: "医生预约",
    content: "去看医生进行年度体检。",
    createdAt: new Date('2024-09-14T09:00:00'),
    isCompleted: true,
    completedAt: new Date('2024-09-14T10:30:00')
  },
  {
    id: 8,
    name: "团队讨论",
    content: "与团队成员讨论项目细节。",
    createdAt: new Date('2024-09-14T11:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  {
    id: 9,
    name: "编写文档",
    content: "更新项目文档。",
    createdAt: new Date('2024-09-14T14:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  // 2024-09-15
  {
    id: 10,
    name: "客户会议",
    content: "与客户进行项目进展会议。",
    createdAt: new Date('2024-09-15T10:00:00'),
    isCompleted: true,
    completedAt: new Date('2024-09-15T11:30:00')
  },
  {
    id: 11,
    name: "代码审查",
    content: "审查团队成员提交的代码。",
    createdAt: new Date('2024-09-15T13:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  {
    id: 12,
    name: "计划周末旅行",
    content: "组织周末去山里的旅行行程。",
    createdAt: new Date('2024-09-15T18:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  // 2024-09-16
  {
    id: 13,
    name: "更新简历",
    content: "更新个人简历。",
    createdAt: new Date('2024-09-16T09:00:00'),
    isCompleted: true,
    completedAt: new Date('2024-09-16T10:00:00')
  },
  {
    id: 14,
    name: "学习新技术",
    content: "学习新的编程技术。",
    createdAt: new Date('2024-09-16T14:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  {
    id: 15,
    name: "家庭聚餐",
    content: "与家人一起吃晚餐。",
    createdAt: new Date('2024-09-16T19:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  // 2024-09-17
  {
    id: 16,
    name: "续保车险",
    content: "联系保险公司续保车险。",
    createdAt: new Date('2024-09-17T10:00:00'),
    isCompleted: true,
    completedAt: new Date('2024-09-17T11:00:00')
  },
  {
    id: 17,
    name: "准备演示文稿",
    content: "为即将到来的项目里程碑演示准备幻灯片。",
    createdAt: new Date('2024-09-17T14:00:00'),
    isCompleted: false,
    completedAt: undefined
  },
  {
    id: 18,
    name: "整理文件",
    content: "整理办公室的文件和资料。",
    createdAt: new Date('2024-09-17T16:00:00'),
    isCompleted: false,
    completedAt: undefined
  }
];
