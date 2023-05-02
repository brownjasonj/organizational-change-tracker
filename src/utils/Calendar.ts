class Calendar {
    static getStartOfDay(date: Date): Date {
        const startOfDay = new Date(date);
        startOfDay.setHours(0,0,0,0);
        return startOfDay;
    }

    static getEndOfDay(date: Date): Date {
        const endOfDay = new Date(date);
        endOfDay.setHours(23,59,59,0);
        return endOfDay;
    }

    static getEndOfNextDay(date:Date, dayStep: number): Date {
        const endOfNextDay = new Date(date);
        endOfNextDay.setDate(date.getDate() + dayStep);
        endOfNextDay.setHours(23,59,59,0);
        return endOfNextDay;
    }

    static getStartOfNextDay(date: Date): Date {
        const startOfNextDay = new Date(date);
        startOfNextDay.setDate(date.getDate() + 1);
        startOfNextDay.setHours(0,0,0,0);
        return startOfNextDay;
    }

    static getStartOfMonth(date: Date): Date {
        const startOfMonth = new Date(date);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        return startOfMonth;
    }

    static getEndOfMonth(date: Date): Date {
        const endOfMonth = new Date(date);
        endOfMonth.setMonth(date.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23,59,59,0);
        return endOfMonth;
    }

    static isSameDay(date1: Date, date2: Date): boolean {
        return (date1.getDay() === date2.getDay() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear());
    }

    static isConsequtiveDay(date1: Date, date2: Date): boolean {
        return this.isSameDay(date1, date2) 
        || this.isSameDay(this.getEndOfNextDay(date1, 1), date2)
        || this.isSameDay(this.getEndOfNextDay(date2, 1), date1);
    }
}

export { Calendar }