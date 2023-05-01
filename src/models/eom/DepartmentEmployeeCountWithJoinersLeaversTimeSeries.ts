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

    addPoint(point: DepartmentEmployeeCountWithJoinersLeaversEpoc): void {
        if (point)
            this.timeseries.push(point);
    }
}

export { DepartmentEmployeeCountWithJoinersLeaversTimeSeries }