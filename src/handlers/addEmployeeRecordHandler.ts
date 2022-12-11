import { Response } from "express";
import neo4j, { Driver } from "neo4j-driver";
import { Context, Handler, Request } from "openapi-backend";
import EmployeeRecord from "../models/EmployeeRecord";
import neo4jAddEmployeeRecord from "../neo4jDriver/neo4jAddEmployeeRecord";

const uri = 'neo4j://localhost:7687';
const driver: Driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'admin'));

const addEmployeeRecordHandler = async (context: Context, request: Request, response: Response) => {
    const employeeRecord : EmployeeRecord = new EmployeeRecord("a726521", "John", "Hawkins", "IT", "Software Engineer", new Date(), new Date());

    const addEmployeeRecordResponse: string = await neo4jAddEmployeeRecord(driver, employeeRecord);

    response.json({ message: addEmployeeRecordResponse });
    };

export default addEmployeeRecordHandler;