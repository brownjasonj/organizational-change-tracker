import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";
import { EmployeeDto } from "../models/dto/EmployeeDto";
import { Employee } from "../models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../rdf-generators/BankOrgRdfDataGenerator";
import { persisteEmployeeDtoStringData } from "../persistence/persistEmployeeDtoStringData";
import { OnToTextGraphDB } from "../persistence/graphdb/OnToTextGraphDB";
import { IRdfGraphDB } from "../interfaces/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/graphPersistenceFactory";



const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getGraphDB();

const addEmployeeRecordHandler = async (context: Context, request: Request, response: Response) => {

    const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
                                                            new Date("2012-01-01"),
                                                            new Date("2012-12-31"),
                                                            new Date("2009-11-02"),
                                                          new Date("9999-12-31"));

    BankOrgRdfDataGenerator(employeeRecord)
    .then((result) => {
        graphDB.turtleUpdate(result)
        .then((res) => {
            console.log(res)
            })
        .catch((err) => console.log(err));
    })
    .catch((error) => {
        console.log(error);
    });
    response.json({ message: "done" });

    };

/*

*/
const addEmployeesHandler =  async (context: Context, request: Request, response: Response) => {
    var employeeRecords: Employee[] = [];
    await request.body.forEach((employeeDto: EmployeeDto) => {
        persisteEmployeeDtoStringData(graphDB, employeeDto)
        .then((result) => {
            employeeRecords.push(result);
        })
        .catch((error) => {
            console.log(error);
        });
    });
    
    response.json(employeeRecords);
};

export { addEmployeeRecordHandler, addEmployeesHandler };