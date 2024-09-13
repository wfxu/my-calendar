// utils/dateUtils.ts
export const getMonthDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
};

export const getPreviousMonthDays = (date: Date, startDay: number): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const previousMonth = new Date(year, month, 0);
    const daysInPreviousMonth = previousMonth.getDate();

    const days = [];
    for (let i = startDay - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, daysInPreviousMonth - i));
    }
    return days;
};

export const getNextMonthDays = (date: Date, totalDays: number): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];

    for (let i = 1; totalDays + i <= 42; i++) {
        days.push(new Date(year, month + 1, i));
    }
    return days;
};
