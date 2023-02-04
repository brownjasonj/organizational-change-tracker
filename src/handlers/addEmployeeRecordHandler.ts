import { Response } from "express";
import neo4j, { Driver } from "neo4j-driver";
import { Context, Handler, Request } from "openapi-backend";
import { ReadableStreamBYOBRequest } from "stream/web";
import { xml2json } from "xml-js";
import { BlazeGraph, BlazeGraphOptions } from "../persistence/blazegraph/blazegraph";
import { EmployeeDto } from "../models/dto/EmployeeDto";
import { Employee } from "../models/eom/Employee";
import { employeeDtoToEmployee } from "../models/mappers/EmployeeMapper";
import neo4jAddEmployeeRecord from "../persistence/neo4jDriver/neo4jAddEmployeeRecord";
import { BankOrgRdfDataGenerator } from "../rdf-generators/BankOrgRdfDataGenerator";
import { persisteEmployeeDtoStringData } from "../persistence/persistEmployeeDtoStringData";
import { GraphDB } from "../persistence/graphdb/GraphDB";

// const uri = 'neo4j://localhost:7687';
// const driver: Driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'admin'));

const blazeGraphOptions: BlazeGraphOptions = new BlazeGraphOptions({});
const blazegraph: BlazeGraph = new BlazeGraph(new BlazeGraphOptions({}));
const graphDB: GraphDB =  new GraphDB();
graphDB.init();

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