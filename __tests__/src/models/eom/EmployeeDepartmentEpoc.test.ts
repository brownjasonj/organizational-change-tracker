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
}

export { EmployeeDepartmentEpoc }