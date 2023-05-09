import { ChildProcess, exec } from "child_process"
import {v4 as uuidv4} from 'uuid';
import { BlazeGraphDB,BlazeGraphDBOptions } from "../../../src/persistence/blazegraph/BlazeGraphDB";
import { IRdfGraphDB, SparqlQueryResultType } from "../../../src/persistence/IRdfGraphDB";
import { BackEndConfiguration, BackEndDBConfiguration } from "../../../src/models/eom/configuration/BackEndConfiguration";
import { plainToClass } from "class-transformer";
import 'reflect-metadata';
import { BlazeGraphRdfQuery } from "../../../src/rdf/BlazeGraphRdfQuery";
import { consoleLogger } from "../../../src/logging/consoleLogger";
import { Employee } from "../../../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../../src/rdf/generators/BankOrgRdfDataGenerator";
import { GraphPersistenceFactory } from "../../../src/persistence/GraphPersistenceFactory";

describe("create a new blazegraph DB", () => {
    let testDirectory: string;
    let blazegraphProcess: ChildProcess;
    let blazegaphRdfQuery: BlazeGraphRdfQuery;

    beforeAll(async () => {
        const myuuid = uuidv4();
        testDirectory = `blazegraph-test-database-${myuuid}`;

        blazegraphProcess = await exec(`mkdir ${testDirectory};
                    cd ${testDirectory};
                    wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar;
                    java -server -Xmx64g -Djetty.port=19999 -jar blazegraph.jar&`);

        const testDBConfigurationName = "blazegraph-test-database";
        const backendConfiguration = {
                "http": {
                    "keepAlive": true,
                    "keepAliveMsecs": 1000,
                    "proxy": false,
                    "rejectUnauthorized": false
                },
                "https": {
                    "keepAlive": true,
                    "keepAliveMsecs": 1000,
                    "proxy": false,
                    "rejectUnauthorized": false,
                    "keyPath": "/etc/letsencrypt/live/yourdomain.com/privkey.pem",
                    "certPath": "/etc/letsencrypt/live/yourdomain.com/fullchain.pem"
                },
                "graphdb": testDBConfigurationName,
                "graphdbconfigs": [
                    {
                        "name": testDBConfigurationName,
                        "type": "blazegraph",
                        "protocol": "http",
                        "host": "localhost",
                        "port": 19999,
                        "namespace": "sparql",
                        "blazename": "blazegraph"
                    }
                ]
            };
        const backEndConfiguration: BackEndConfiguration = plainToClass(BackEndConfiguration, backendConfiguration);
        const blazegraphDBOptions: BlazeGraphDBOptions = plainToClass(BlazeGraphDBOptions, backEndConfiguration.getGraphDBConfiguration(testDBConfigurationName));

        GraphPersistenceFactory.setBackEndConfiguration(backEndConfiguration);
        
        console.log(`backEndConfiguration: ${JSON.stringify(backEndConfiguration)}`);
        // console.log(`blazegraphDBOptions: ${JSON.stringify(backEndConfiguration.getGraphDBConfiguration(testDBConfigurationName))}`);
        console.log(`blazegraphDBOptions: ${JSON.stringify(blazegraphDBOptions)}`);
        

        // To use the BlazeGraph, uncomment the following line and comment out the OnToTextGraphDB line
        const graphdb: IRdfGraphDB = new BlazeGraphDB(backEndConfiguration, blazegraphDBOptions);

        blazegaphRdfQuery = new BlazeGraphRdfQuery(graphdb, consoleLogger);

        // insert an employee population that we will run all the tests against

        const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
            new Date("2012-01-01"),
            new Date("2012-12-31"),
            new Date("2009-11-02"),
            new Date("9999-12-31"));

        const turtleData: string = await BankOrgRdfDataGenerator(employeeRecord);
        const insertResponse = await graphdb.turtleUpdate(turtleData); 
    });

    afterAll(async () => {
        await blazegraphProcess.kill();
        await exec(`rm -rf ${testDirectory}`);
    });

    test("Test retreiving employee by Id", async () => {
        try {
            const result = await blazegaphRdfQuery.getEmployeeByEmployeeId("4041234");
            console.log(result);
        }
        catch (err) {
            console.log(err);
        }
        expect(true).toBe(true);
    });
});