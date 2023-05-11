class EmployeeDepartmentEpoc {
    employeeId: string;
    department: string;
    startdate: string;
    enddate: string;

    constructor(employeeId: string, department: string, startdate: string, enddate: string) {
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

    getStartDate(): string {
        return this.startdate;
    }

    getEndDate(): string {
        return this.enddate;
    }
}

export { EmployeeDepartmentEpoc }