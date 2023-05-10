import { DepartmentEmployeeCountTimeEpoc } from "./DepartmentEmployeeCountTimeEpoc";

class DepartmentEmployeeCountTimeSeries {
    departmentName: string;
    startDate: Date;
    endDate: Date;
    dateStep: number;
    timeseries: DepartmentEmployeeCountTimeEpoc[];

    constructor(departmentName: string, startDate: Date, endDate: Date, dateStep: number) {
        this.departmentName = departmentName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dateStep = dateStep;
        this.timeseries = [];
    }

    addPoint(point: DepartmentEmployeeCountTimeEpoc): void {
        if (point)
            this.timeseries.push(point);
    }

    getDepartmentName(): string {
        return this.departmentName;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getDateStep(): number {
        return this.dateStep;
    }

    getTimeseries(): DepartmentEmployeeCountTimeEpoc[] {
        return this.timeseries;
    }
}

export { DepartmentEmployeeCountTimeSeries }