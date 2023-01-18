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
        if (employmentEndDate == this.magicDate) {
            this.employmentEndDate = new Date();
        }
        else {
            this.employmentEndDate = employmentEndDate;
        }
    }
}

export { Employee };