class EmployeeRecord {
    id: string;
    firstName: string;
    secondName: string;
    department: string;
    jobTitle: string;
    startDate: Date;
    endDate: Date;

    constructor(id: string, firstName: string, secondName: string, department: string, jobTitle: string, startDate: Date, endDate: Date) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.department = department;
        this.jobTitle = jobTitle;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export default EmployeeRecord;