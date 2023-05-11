class EmployeeDepartmentEpoc {
    employeeId: string;
    department: string;
    startdate: Date;
    enddate: Date;

    constructor(employeeId: string, department: string, startdate: Date, enddate: Date) {
        this.employeeId = employeeId;
        this.department = department;
        this.startdate = startdate;
        this.enddate = enddate;
    }

    getEmployeeId(): string {
        return this.employeeId;
    }

    getDepartment(): string {
        return this.department;
    }

    getStartDate(): Date {
        return this.startdate;
    }

    getEndDate(): Date {
        return this.enddate;
    }
}

export { EmployeeDepartmentEpoc }