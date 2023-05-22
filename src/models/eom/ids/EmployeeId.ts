class EmployeeId {
    employeeId: string;
    systemId: string;
    firstName: string;
    secondName: string;

    constructor(employeeId: string, systemId: string, firstName: string, secondName: string) {
        this.employeeId = employeeId;
        this.systemId = systemId;
        this.firstName = firstName;
        this.secondName = secondName;
    }
}

export { EmployeeId }