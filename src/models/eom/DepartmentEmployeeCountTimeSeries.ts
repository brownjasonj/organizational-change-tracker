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
}

export { DepartmentEmployeeCountTimeSeries }