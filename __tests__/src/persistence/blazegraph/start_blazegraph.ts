import { ChildProcess, exec, spawn } from "child_process"
import {v4 as uuidv4} from 'uuid';
import { BackEndConfiguration } from "../../../../src/models/eom/configuration/BackEndConfiguration";
import 'reflect-metadata';
import { BlazeGraphRdfQuery } from ".../../../src/rdf/BlazeGraphRdfQuery";
import { consoleLogger } from "../../../../src/logging/consoleLogger";
import { GraphPersistenceFactory } from "../../../../src/persistence/GraphPersistenceFactory";
import { ConfigurationManager } from "../../../../src/ConfigurationManager";
import { ApplicationConfiguration } from "../../../../src/models/eom/configuration/ApplicationConfiguration";

const myuuid = uuidv4();
const testDirectory = `blazegraph-test-database-${myuuid}`;

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

const graphdb = GraphPersistenceFactory.getInstance().getGraphDB();
const blazegaphRdfQuery = new BlazeGraphRdfQuery(applicationConfiguration.getRdfOntologyConfiguration(), graphdb, consoleLogger);

// start the blazegraph server
// create a new directory for the blazegraph database
// grap the blazegraph jar file
//
// wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar
//
let readyToStart: Promise<ChildProcess> | undefined;

const blazegraphSetupProcess = spawn(`mkdir ${testDirectory}; cd ${testDirectory}; java -server -Xmx64g -Djetty.port=19997 -jar /Users/jason/Downloads/blazegraph.jar`, [], { shell: true, stdio: ['pipe'], detached: true});
readyToStart = new Promise((resolve, reject) => {
    if (blazegraphSetupProcess.stdout) {
        blazegraphSetupProcess.stdout.on('data', (data) => {
            consoleLogger.info(`stdout: ${data}`);
            // wait for the blazegraph server to start, this is determined by the string 
            //  http://[::]:${port}/blazegraph/ to get started
            // has been output!

            // var indexOf = data.search(/http:\/\/([A-Z|a-z|0-9])*:19997\/blazegraph/);
            var indexOf = data.indexOf('http://172.20.10.8:19997/blazegraph/');
            consoleLogger.info(`indexOf: ${indexOf}`);
            if (indexOf >= 0) {
                resolve(blazegraphSetupProcess);
            }
        });
    }
    else {
        reject(undefined);
    }
});


export { readyToStart };



