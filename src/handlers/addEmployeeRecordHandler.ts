import { Response } from "express";
import neo4j, { Driver } from "neo4j-driver";
import { Context, Handler, Request } from "openapi-backend";
import EmployeeRecord from "../models/EmployeeRecord";
import neo4jAddEmployeeRecord from "../neo4jDriver/neo4jAddEmployeeRecord";
import organizationaRdfGenerator from "../rdf-generators/OrganizationRdfGenerator";

const uri = 'neo4j://localhost:7687';
const driver: Driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'admin'));

const addEmployeeRecordHandler = async (context: Context, request: Request, response: Response) => {
    const employeeRecord1 : EmployeeRecord = new EmployeeRecord("2123456", "a123456", "John", "Hawkins", "Dept1", "Staff",
                                                            new Date("2012-01-01T00:00:00Z"),
                                                            new Date("2012-12-31T00:00:00Z"),
                                                            new Date("2009-11-02T09:00:00Z"),
                                                            new Date("9999-12-31"));
    const employeeRecord2 : EmployeeRecord = new EmployeeRecord("2123456", "b123456", "John", "Hawkins", "Dept1", "Staff",
                                                            new Date("2012-01-01T00:00:00Z"),
                                                            new Date("2012-12-31T00:00:00Z"),
                                                            new Date("2009-11-02T09:00:00Z"),
                                                            new Date("9999-12-31"));
    const employeeRecord3 : EmployeeRecord = new EmployeeRecord("2123456", "a123456", "John", "Hawkins", "Dept1", "AVP",
                                                            new Date("2013-01-01T00:00:00Z"),
                                                            new Date("2013-12-31T00:00:00Z"),
                                                            new Date("2009-11-02T09:00:00Z"),
                                                            new Date("9999-12-31"));
    const employeeRecord4 : EmployeeRecord = new EmployeeRecord("2123456", "b123456", "John", "Hawkins", "Dept1", "AVP",
                                                            new Date("2013-01-01T00:00:00Z"),
                                                            new Date("2013-12-31T00:00:00Z"),
                                                            new Date("2009-11-02T09:00:00Z"),
                                                            new Date("9999-12-31"));

    /*
    var addEmployeeRecordResponse: string = await neo4jAddEmployeeRecord(driver, employeeRecord1);
    addEmployeeRecordResponse = await neo4jAddEmployeeRecord(driver, employeeRecord2);
    addEmployeeRecordResponse = await neo4jAddEmployeeRecord(driver, employeeRecord3);
    */
    organizationaRdfGenerator(employeeRecord1);
    organizationaRdfGenerator(employeeRecord2);
    
   
    response.json({ message: "done" });

    };

export default addEmployeeRecordHandler;