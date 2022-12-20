import { Response } from "express";
import neo4j, { Driver } from "neo4j-driver";
import { Context, Handler, Request } from "openapi-backend";
import EmployeeRecord from "../models/EmployeeRecord";
import neo4jAddEmployeeRecord from "../neo4jDriver/neo4jAddEmployeeRecord";
import organizationaRdfGenerator from "../rdf-generators/OrganizationRdfGenerator";

const uri = 'neo4j://localhost:7687';
const driver: Driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'admin'));

const addEmployeeRecordHandler = async (context: Context, request: Request, response: Response) => {
    const employeeRecord1 : EmployeeRecord = new EmployeeRecord("a726521", "John", "Hawkins", "Dept1", "Staff", new Date("2009-11-02T09:00:00Z"), new Date());
    const employeeRecord2 : EmployeeRecord = new EmployeeRecord("a726521", "John", "Hawkins", "Dept2", "AVP", new Date("2022-05-01T09:00:00Z"), new Date());
    const employeeRecord3 : EmployeeRecord = new EmployeeRecord("a726521", "John", "Hawkins", "Dept3", "VP", new Date("2009-11-02T09:00:00Z"), new Date());

    /*
    var addEmployeeRecordResponse: string = await neo4jAddEmployeeRecord(driver, employeeRecord1);
    addEmployeeRecordResponse = await neo4jAddEmployeeRecord(driver, employeeRecord2);
    addEmployeeRecordResponse = await neo4jAddEmployeeRecord(driver, employeeRecord3);
    */
    organizationaRdfGenerator(employeeRecord1, new Date("2022-05-01T09:00:00Z"));
    organizationaRdfGenerator(employeeRecord2, new Date("2022-12-17T09:00:00Z"));
    
   
    response.json({ message: "done" });

    };

export default addEmployeeRecordHandler;