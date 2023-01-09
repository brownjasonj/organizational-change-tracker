import { Response } from "express";
import neo4j, { Driver } from "neo4j-driver";
import { Context, Handler, Request } from "openapi-backend";
import { ReadableStreamBYOBRequest } from "stream/web";
import EmployeeRecord from "../models/EmployeeRecord";
import neo4jAddEmployeeRecord from "../neo4jDriver/neo4jAddEmployeeRecord";
import organizationaRdfGenerator from "../rdf-generators/OrganizationRdfGenerator";

const uri = 'neo4j://localhost:7687';
const driver: Driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'admin'));

const addEmployeeRecordHandler = async (context: Context, request: Request, response: Response) => {
    const employeeRecord1 : EmployeeRecord = new EmployeeRecord("01", "01", "John", "Hawkins", "A", "Staff",
                                                            new Date("2012-01-01"),
                                                            new Date("2012-12-31"),
                                                            new Date("2009-11-02"),
                                                            new Date("9999-12-31"));
    const employeeRecord2 : EmployeeRecord = new EmployeeRecord("02", "02", "John", "Hawkins", "AB", "Staff",
                                                            new Date("2012-01-01"),
                                                            new Date("2012-12-31"),
                                                            new Date("2009-11-02"),
                                                            new Date("9999-12-31"));
    const employeeRecord3 : EmployeeRecord = new EmployeeRecord("03", "03", "John", "Hawkins", "ABC", "AVP",
                                                            new Date("2013-01-01"),
                                                            new Date("2013-12-31"),
                                                            new Date("2009-11-02"),
                                                            new Date("9999-12-31"));
    const employeeRecord4 : EmployeeRecord = new EmployeeRecord("04", "04", "John", "Hawkins", "ABCD", "AVP",
                                                            new Date("2013-01-01"),
                                                            new Date("2013-12-31"),
                                                            new Date("2009-11-02"),
                                                            new Date("9999-12-31"));

    /*
    var addEmployeeRecordResponse: string = await neo4jAddEmployeeRecord(driver, employeeRecord1);
    addEmployeeRecordResponse = await neo4jAddEmployeeRecord(driver, employeeRecord2);
    addEmployeeRecordResponse = await neo4jAddEmployeeRecord(driver, employeeRecord3);
    */
    organizationaRdfGenerator(employeeRecord1);
    organizationaRdfGenerator(employeeRecord2);
    organizationaRdfGenerator(employeeRecord3);
    organizationaRdfGenerator(employeeRecord4);
   
    response.json({ message: "done" });

    };

export default addEmployeeRecordHandler;