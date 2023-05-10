class Employee {
    private magicDate = new Date("9999-12-31T00:00:00Z");
    employee_id: string;
    system_id: string;
    firstName: string;
    secondName: string;
    jobTitle: string;
    department: string;
    departmentStartDate: Date;
    departmentEndDate: Date;
    employmentStartDate: Date;
    employmentEndDate: Date;

    constructor(id: string,
                system_id: string,
                firstName: string,
                secondName: string,
                department: string,
                jobTitle: string,
                departmentStartDate: Date,
                departmentEndDate: Date,
                employmentStartDate: Date,
                employmentEndDate: Date) {
        this.employee_id = id;
        this.system_id = system_id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.department = department;
        this.jobTitle = jobTitle;
        this.departmentStartDate = departmentStartDate;
        this.departmentEndDate = departmentEndDate;
        this.employmentStartDate = employmentStartDate;
        this.employmentEndDate = employmentEndDate;
        // if (employmentEndDate == this.magicDate) {
        //     this.employmentEndDate = new Date();
        // }
        // else {
        //     this.employmentEndDate = employmentEndDate;
        // }
    }

    getEmployeeId(): string {
        return this.employee_id;
    }

    getSystemId(): string {
        return this.system_id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getSecondName(): string {
        return this.secondName;
    }

    getJobTitle(): string {
        return this.jobTitle;
    }

    getDepartment(): string {
        return this.department;
    }

    getDepartmentStartDate(): Date {
        return this.departmentStartDate;
    }

    getDepartmentEndDate(): Date {
        return this.departmentEndDate;
    }

    getEmploymentStartDate(): Date {
        return this.employmentStartDate;
    }

    getEmploymentEndDate(): Date {
        return this.employmentEndDate;
    }    
}

export { Employee };