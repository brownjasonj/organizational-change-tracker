import { Duplex } from "stream";
import { EmployeeDto } from "../models/dto/EmployeeDto";
import { employeeDtoToEmployee } from "../models/mappers/EmployeeMapper";
import { Employee } from "../models/eom/Employee";


class StreamTransformEmployeeDtoToEmployee extends Duplex {
    constructor() {
        super({ objectMode: true });
    }

    _write(data: EmployeeDto, encoding: string, callback: Function) {
        console.log(data);
        const employeeRecord: Employee = employeeDtoToEmployee(data);
        this.push(employeeRecord);
        callback();
    }

    _read() {
        // do nothing
    }
}

export { StreamTransformEmployeeDtoToEmployee }