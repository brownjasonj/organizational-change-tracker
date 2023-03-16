
enum EmployeeLeaverJoinerType {
    LEAVER = "Leaver",
    JOINER = "Joiner"
}

class EmployeeLeaverJoiner {
    status: EmployeeLeaverJoinerType;
    pid: string;
    department: string;
    date: Date;

    constructor(pid: string, department: string, date: Date, status: EmployeeLeaverJoinerType) {
        this.pid = pid;
        this.department = department;
        this.date = date;
        this.status = status;
    }
}

export { EmployeeLeaverJoiner, EmployeeLeaverJoinerType }