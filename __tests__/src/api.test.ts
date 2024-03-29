import 'reflect-metadata';
import supertest from 'supertest';
import { FrontEndServer } from '../../src/FrontEndServer';
import { graphDBProcess, stopGraphDBProcess, graphdb, blazegraphRdfQuery, rdfOntologiesDefinition, backEndConfiguration } from "./persistence/blazegraph/start_blazegraph";
import { MapEmployeesToBankRdfOntologyTurtle } from '../../src/rdf/generators/MapEmployeesToBankOrgRdfTurtle';
import { Employee } from "../../src/models/eom/Employee";
import { EmployeeDto } from "../../src/models/dto/EmployeeDto";
import { employeeDtoToEmployee } from "../../src/models/mappers/EmployeeMapper";
import { HttpClient } from '../../src/utils/HttpClient';
import { DataIngestionStreamStatuses } from '../../src/dataingestors/DataIngestionStreamStatuses';
import { DataIngestionPipeline } from '../../src/dataingestors/DataIngestionPipeline';
import { plainToClass } from 'class-transformer';
import { DataIngestionConfiguration } from '../../src/models/eom/configuration/DataIngestionConfiguration';
import { LoggingConfiguration } from '../../src/models/eom/configuration/LoggingConfiguration';


const dataIngestionConfigurationData = {
    "temporaryDirectory": "./tmp",
    "ontologyValidation": false,
    "ontologyValidationSchemaPath": "./rdf/ontology/bank-organization.ttl",
    "ontologyValidationSchemaFormat": "text/turtle",
    "deleteTemporaryFiles": true,
    "streamTrottleTimeout": 1000
};
const dataIngestionConfiguration: DataIngestionConfiguration = plainToClass(DataIngestionConfiguration, dataIngestionConfigurationData);

const loggingConfigurationData = {
    "dataIngestionLogging": false,
    "dataIngestionLoggingLevel": "info",
    "dataIngestionLoggingPath": "",
    "dataIngestionDeadLetterPath": "",
    "queryLogging": false,
    "queryLoggingLevel": "info",
    "queryLoggingPath": ""
};
const loggingConfiguration = plainToClass(LoggingConfiguration, loggingConfigurationData);

const httpClient = new HttpClient(backEndConfiguration);
const dataIngestionStatuses = new DataIngestionStreamStatuses();
const dataIngestionPipeline = new DataIngestionPipeline(blazegraphRdfQuery, dataIngestionConfiguration, dataIngestionStatuses, loggingConfiguration, httpClient);

const expresServer = new FrontEndServer(blazegraphRdfQuery, dataIngestionPipeline);
const requestWithSupertest: supertest.SuperTest<supertest.Test> = supertest(expresServer.getExpressServer());

describe(`Test API`, () => {
    const employeeRecords : Employee[] = [
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "Staff", "01.01.2000", "01.02.2000", "01.01.2000","31.12.9999")),
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "Staff", "02.02.2000", "01.03.2000", "01.01.2000","31.12.9999")),
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "B", "AVP", "02.03.2000", "01.05.2000", "01.01.2000","31.12.9999")),
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "C", "VP", "02.05.2000", "01.12.2010", "01.01.2000","31.12.9999")),
        // employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "DIR", "02.12.2010", "01.12.2011", "01.01.2000","31.12.9999")),
        // employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "MDR", "02.12.2011", "01.12.2012", "01.01.2000","31.12.9999"))
        employeeDtoToEmployee(new EmployeeDto("2", "A2", "Fred", "Flintstone", "CD", "VP", "02.05.2000", "01.12.2010", "01.01.2000","31.12.9999"))

    ];

    beforeAll(() => {
        return new Promise((resolve, reject) => {
            if (graphDBProcess) {
                graphDBProcess.then((childprocess) => {
                    MapEmployeesToBankRdfOntologyTurtle(rdfOntologiesDefinition, employeeRecords).then((turtleData) => {
                        console.log(turtleData);
                        graphdb.turtleUpdate(turtleData).then((insertResponse) => {
                            console.log(insertResponse);
                            resolve(insertResponse);
                        }).catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                        }).catch((err) => {
                    console.log("server not started");
                });
            }
        });
    });

    afterAll(() => {
        stopGraphDBProcess();
    }, 10000);
    
    test("Test get employee by employee id /employee/1000001", async () => {
        const res = await requestWithSupertest.get('/employee/1000001');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /employee/1000001/corporateTitles", async () => {
        const res = await requestWithSupertest.get('/employee/1000001/corporateTitles');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /employee/1000001/departments", async () => {
        const res = await requestWithSupertest.get('/employee/1000001/departments');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/employees", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/employees');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/employeeCount", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/employeeCount');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeeCount?datestep=month", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeeCount?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeesJoiningLeaving", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesJoiningLeaving?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeesJoining", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesJoining?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeesLeaving", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesLeaving?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /departments/2010-01-01", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesLeaving?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });
    
    test("Test getting configuration /operations/status/uploads", async () => {
        const res = await requestWithSupertest.get('/operations/status/uploads');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test getting configuration /operations/configuration", async () => {
        const res = await requestWithSupertest.get('/operations/configuration');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /id/employee-id/1000001", async () => {
        const res = await requestWithSupertest.get('/id/employee-id/1000001');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /id/employee-system-id/A0000001", async () => {
        const res = await requestWithSupertest.get('/id/employee-system-id/A0000001');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    /*
        /department/hierachy/{departmentcode}/{depth}/{asofdate}:
    */
    test("Test get department hierarchy /department/C/1/2010-01-01", async () => {
        const res = await requestWithSupertest.get('/department/hierachy/C/1/2010-01-01');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

});