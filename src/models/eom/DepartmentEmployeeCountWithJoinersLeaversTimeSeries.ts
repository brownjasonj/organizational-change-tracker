import { DepartmentEmployeeCountWithJoinersLeaversEpoc } from "./DepartmentEmployeeCountWithJoinersLeaversTimeEpoc";
import { EmployeeCountByDepartmentTimeEpoc } from "./EmployeeCountByDepartmentTimeEpoc";

class DepartmentEmployeeCountWithJoinersLeaversTimeSeries {
    departmentName: string;
    startDate: Date;
    endDate: Date;
    dateStep: number;
    timeseries: DepartmentEmployeeCountWithJoinersLeaversEpoc[];

    constructor(departmentName: string, startDate: Date, endDate: Date, dateStep: number) {
        this.departmentName = departmentName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dateStep = dateStep;
        this.timeseries = [];
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

    addPoint(point: DepartmentEmployeeCountWithJoinersLeaversEpoc): void {
        if (point)
            this.timeseries.push(point);
    }
}

export { DepartmentEmployeeCountWithJoinersLeaversTimeSeries }