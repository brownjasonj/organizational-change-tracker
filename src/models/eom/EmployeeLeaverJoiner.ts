
enum EmployeeLeaverJoinerType {
    LEAVER = "Leaver",
    JOINER = "Joiner"
}

class EmployeeLeaverJoiner {
    status: EmployeeLeaverJoinerType;
    employeeId: string;
    department: string;
    date: Date;

    constructor(employeeId: string, department: string, date: Date, status: EmployeeLeaverJoinerType) {
        this.employeeId = employeeId;
        this.department = department;
        this.date = date;
        this.status = status;
    }

    getStatus(): EmployeeLeaverJoinerType {
        return this.status;
    }

    getEmployeeId(): string {
        return this.employeeId;
    }

    getDepartment(): string {
        return this.department;
    }
    
    getDate(): Date {
        return this.date;
    }
}

export { EmployeeLeaverJoiner, EmployeeLeaverJoinerType }