import { xml2json } from "xml-js";
import { IRdfGraphDB } from "../interfaces/IRdfGraphDB";
import { EmployeeDto } from "../models/dto/EmployeeDto";
import { Employee } from "../models/eom/Employee";
import { employeeDtoToEmployee } from "../models/mappers/EmployeeMapper";
import { BankOrgRdfDataGenerator } from "../rdf-generators/BankOrgRdfDataGenerator";


const persisteEmployeeDtoStringData = (graphDB: IRdfGraphDB, employeeDto: EmployeeDto): Promise<Employee>=> {
    return new Promise((resolve, reject) => {
        const employeeRecord: Employee = employeeDtoToEmployee(employeeDto);
        console.log(employeeRecord);
        BankOrgRdfDataGenerator(employeeRecord)
        .then((result) => {
            graphDB.turtleUpdate(result)
            .then((res) => {
                console.log(xml2json(res));
                resolve(employeeRecord);
                })
            .catch((err) => {
                console.log(err);
                reject(err)
            });
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}

export { persisteEmployeeDtoStringData }