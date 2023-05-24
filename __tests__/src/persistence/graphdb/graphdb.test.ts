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

    test("Test Joiners Query: Employee has been in department 'A' in different epocs.", async () => {
        const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getInstance().getGraphDB();
        // await graphDB.init();
        // Employee 1, joins a department 'A' from outside organization on 2000-01-01 and epoc ends on 2000-02-01
        // Employee 1, epoc in 'A' continues on 2000-02-02 and leaves on 2000-03-01
        // Employee 1, joins in 'B' on 2000-03-02 and leaves on 2000-05-01
        // Employee 1, joins in 'C' on 2000-05-02 and leaves on 2010-12-01
        // Employee 1, joins in 'A' on 2010-12-02 and leaves on 2011-12-01
        // Employee 1, joins in 'A' on 2011-12-02 and leaves on 2012-12-01
        //
        // Note that the intention is that the first 'A' is different from the second  'A' in that the organization
        // has changed overtime and just reused the names!  But we want to be able to distinguish a joiner/leaver
        // in this sense.  
        // 
        const employeeRecord1 : Employee = new Employee("1", "A1", "John", "Hawkins", "A", "Staff",
            new Date("2012-01-01"),
            new Date("2012-12-31"),
            new Date("2009-11-02"),
            new Date("9999-12-31"));
        const employeeRecord2 : Employee = new Employee("4041235", "A041235", "John", "Hawkins", "A", "Staff",
            new Date("2012-01-01"),
            new Date("2012-12-31"),
            new Date("2009-11-02"),
            new Date("9999-12-31"));
        const turtleData: string = await BankOrgRdfDataGenerator(employeeRecord1);
        expect(turtleData).toBeDefined();
        const insertResponse = await graphDB.turtleUpdate(turtleData);
        expect(insertResponse).toBeDefined();
    }
});
