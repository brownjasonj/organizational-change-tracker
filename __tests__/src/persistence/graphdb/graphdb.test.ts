import { Employee } from "../../../../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../../../src/rdf/generators/BankOrgRdfDataGenerator";
import { GraphPersistenceFactory } from "../../../../src/persistence/GraphPersistenceFactory";
import { IRdfGraphDB } from "../../../../src/persistence/IRdfGraphDB";
import 'reflect-metadata';
import {v4 as uuidv4} from 'uuid';

import { ChildProcess, exec } from "child_process";
import { BackEndConfiguration } from "../../../../src/models/eom/configuration/BackEndConfiguration";
import { plainToClass } from "class-transformer";

describe("GraphDB IRdfGraph interface testing", () => {
    let testDirectory: string;
    let blazegraphProcess: ChildProcess;
    
    beforeAll(() => {
        const myuuid = uuidv4();
        testDirectory = `blazegraph-test-database-${myuuid}`;
        const testDBConfigurationName = "blazegraph-test-database";
        const blazegraphPort = 19999;
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
                        "port": blazegraphPort,
                        "namespace": "sparql",
                        "blazename": "blazegraph"
                    }
                ]
            };
        const backEndConfiguration: BackEndConfiguration = plainToClass(BackEndConfiguration, backendConfiguration);
        GraphPersistenceFactory.setBackEndConfiguration(backEndConfiguration);

        blazegraphProcess = exec(`mkdir ${testDirectory};
                cd ${testDirectory};
                wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar;
                java -server -Xmx64g -Djetty.port=${blazegraphPort} -jar blazegraph.jar&`);
    });
    
    afterAll(() => {
        if (blazegraphProcess.kill()) {
            exec(`rm -rf ${testDirectory}`);
        }
    });

    afterEach(() => {
        GraphPersistenceFactory.getInstance().getGraphDB();
    });

    test("Load single employee turtle and retreive", async () => {
        const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getInstance().getGraphDB();
        // await graphDB.init();
        const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
            new Date("2012-01-01"),
            new Date("2012-12-31"),
            new Date("2009-11-02"),
            new Date("9999-12-31"));
        const turtleData: string = await BankOrgRdfDataGenerator(employeeRecord);
        expect(turtleData).toBeDefined();
        const insertResponse = await graphDB.turtleUpdate(turtleData);
        expect(insertResponse).toBeDefined();
    });


});
