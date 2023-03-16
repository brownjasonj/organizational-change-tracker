import { EmployeeCountByDepartmentTimeEpoc } from "./EmployeeCountByDepartmentTimeEpoc";

class DepartmentTimeSeries {
    departmentName: string;
    startDate: Date;
    endDate: Date;
    dateStep: number;
    timeseries: EmployeeCountByDepartmentTimeEpoc[];

    constructor(departmentName: string, startDate: Date, endDate: Date, dateStep: number) {
        this.departmentName = departmentName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dateStep = dateStep;
        this.timeseries = [];
    }

    addPoint(point: EmployeeCountByDepartmentTimeEpoc): void {
        if (point)
            this.timeseries.push(point);
    }
}

export { DepartmentTimeSeries }