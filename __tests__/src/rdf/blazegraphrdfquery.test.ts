import { ChildProcess, exec } from "child_process"
import {v4 as uuidv4} from 'uuid';
import { IRdfGraphDB } from "../../../src/persistence/IRdfGraphDB";
import { BackEndConfiguration } from "../../../src/models/eom/configuration/BackEndConfiguration";
import 'reflect-metadata';
import { BlazeGraphRdfQuery } from ".../../../src/rdf/BlazeGraphRdfQuery";
import { consoleLogger } from "../../../src/logging/consoleLogger";
import { Employee } from "../../../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../../src/rdf/generators/BankOrgRdfDataGenerator";
import { GraphPersistenceFactory } from "../../../src/persistence/GraphPersistenceFactory";
import { ConfigurationManager } from "../../../src/ConfigurationManager";
import { ApplicationConfiguration } from "../../../src/models/eom/configuration/ApplicationConfiguration";
import { MapEmployeesToBankRdfOntologyTurtle } from "../../../src/rdf/generators/MapEmployeesToBankOrgRdfTurtle";

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
describe("create a new blazegraph DB", () => {
    let testDirectory: string;
    let blazegraphSetupProcess: ChildProcess;
    let blazegraphProcess: ChildProcess;
    let blazegaphRdfQuery: BlazeGraphRdfQuery;
    let graphdb: IRdfGraphDB;

    const employeeRecords : Employee[] = [
        new Employee("1", "A1", "John", "Hawkins", "A", "Staff", new Date("2000-01-01"), new Date("2000-02-01"), new Date("2000-01-01"),new Date("9999-12-31")),
        new Employee("1", "A1", "John", "Hawkins", "A", "Staff", new Date("2000-02-02"), new Date("2000-03-01"), new Date("2000-01-01"), new Date("9999-12-31"))
    ];

    beforeAll(() => {
        return new Promise((resolve, reject) => {
            const myuuid = uuidv4();
            testDirectory = `blazegraph-test-database-${myuuid}`;
            
            ConfigurationManager.getInstance().setApplicationConfigurationFromFile("./__tests__/config/application-test-config.json");
            
            // get the application configuration
            const applicationConfiguration: ApplicationConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration();
            
            /*
                Set up the back end server according to the given configuration
            */
            const backEndConfiguration: BackEndConfiguration = applicationConfiguration.getBackEndConfiguration();
            
            GraphPersistenceFactory.setBackEndConfiguration(backEndConfiguration);


            console.log(`backEndConfiguration: ${JSON.stringify(backEndConfiguration)}`);
            // console.log(`blazegraphDBOptions: ${JSON.stringify(backEndConfiguration.getGraphDBConfiguration(testDBConfigurationName))}`);
            // console.log(`blazegraphDBOptions: ${JSON.stringify(blazegraphDBOptions)}`);
            

            // To use the BlazeGraph, uncomment the following line and comment out the OnToTextGraphDB line
            // graphdb = new BlazeGraphDB(backEndConfiguration, blazegraphDBOptions);

            graphdb = GraphPersistenceFactory.getInstance().getGraphDB();
            blazegaphRdfQuery = new BlazeGraphRdfQuery(graphdb, consoleLogger);

            // start the blazegraph server
            // create a new directory for the blazegraph database
            // grap the blazegraph jar file
            blazegraphSetupProcess = exec(`mkdir ${testDirectory};
                        cd ${testDirectory};
                        wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar`, (error, stdout, stderr) => {
                            if (error) {
                                consoleLogger.error(`exec error: ${error}`);
                                reject(error);
                            }
                            else { 
                                blazegraphProcess = exec(`cd ${testDirectory}; java -server -Xmx64g -Djetty.port=19999 -jar blazegraph.jar&`, (error, stdout, stderr) => {
                                    if (error) {
                                        consoleLogger.error(`exec error: ${error}`);
                                        reject(error);
                                    }
                                    else {                                            
                                        consoleLogger.info(`stdout: ${stdout}`);
                                        consoleLogger.info(`stderr: ${stderr}`);
                                        MapEmployeesToBankRdfOntologyTurtle(employeeRecords).then((turtleData) => {
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
                                    }});
                            }});
        });
    }, 600000);

    afterAll(() => {
        return new Promise((resolve, reject) => {
            blazegraphSetupProcess.kill();
            blazegraphProcess.kill();
            exec(`rm -rf ${testDirectory}`, (error, stdout, stderr) => {
                if (error) {
                    consoleLogger.error(`exec error: ${error}`);
                    reject(error);
                }
                else {
                    consoleLogger.info(`stdout: ${stdout}`);
                    consoleLogger.info(`stderr: ${stderr}`);
                    resolve(stdout);
                }
            });
        });
    });

    test("0 Joiners in department A, between 1999-01-01 and 1999-12-31", () => {
       return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentJoiners("A", new Date("1999-01-01"), new Date("1999-12-31")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(0));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });
    
    test("1 Joiner, department A, between 2000-01-01 and 2000-02-01", () => {
        return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentJoiners("A", new Date("2000-01-01"), new Date("2000-01-31")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(1));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });

    test("0 Joiner, department A, between 2000-01-02 and 2000-02-01", () => {
        return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentJoiners("A", new Date("2000-01-02"), new Date("2000-01-31")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(0));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });

});