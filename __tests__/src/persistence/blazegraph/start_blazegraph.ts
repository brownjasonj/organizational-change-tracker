import { ChildProcess, exec, execSync, spawn } from "child_process"
import {v4 as uuidv4} from 'uuid';
import { BackEndConfiguration } from "../../../../src/models/eom/configuration/BackEndConfiguration";
import 'reflect-metadata';
import { BlazeGraphRdfQuery } from ".../../../src/rdf/BlazeGraphRdfQuery";
import { consoleLogger } from "../../../../src/logging/consoleLogger";
import { GraphPersistenceFactory } from "../../../../src/persistence/GraphPersistenceFactory";
import { plainToClass } from "class-transformer";
import { RdfOntologyConfiguration } from "../../../../src/models/eom/configuration/RdfOntologyConfiguration";


function numberBetween(min: number, max: number) {  
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

const myuuid = uuidv4();
const graphDBTestWorkingDirectory = `blazegraph-test-database-${myuuid}`;
const graphDBPort = numberBetween(10000, 60000);

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
    "graphdb": graphDBTestWorkingDirectory,
    "graphdbconfigs": [
        {
            "name": graphDBTestWorkingDirectory,
            "type": "blazegraph",
            "protocol": "http",
            "host": "localhost",
            "port": graphDBPort,
            "namespace": "sparql",
            "blazename": "blazegraph"
        }
    ]
};

const backEndConfiguration: BackEndConfiguration = plainToClass(BackEndConfiguration, backendConfiguration);
GraphPersistenceFactory.setBackEndConfiguration(backEndConfiguration);

console.log(`backEndConfiguration: ${JSON.stringify(backEndConfiguration)}`);


// To use the BlazeGraph, uncomment the following line and comment out the OnToTextGraphDB line

const graphdb = GraphPersistenceFactory.getInstance().getGraphDB();


const rdfOntologiesDefinitionStructure = {
    "prefixes": {
        "bank-org": "http://example.org/bank-org#",
        "organization-id": "http://example.org/organization-id/",
        "employee-id": "http://example.org/employee-id/",
        "membership-id": "http://example.org/membership-id/",
        "time-id": "http://example.org/time-id/",
        "time-interval-id": "http://example.org/time-interval-id/",
        "org": "http://www.w3.org/ns/org#",
        "time": "http://www.w3.org/2006/time#",
        "interval": "http://example.org/interval#",
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "foaf": "http://xmlns.com/foaf/0.1#"
    }
}

const rdfOntologiesDefinition: RdfOntologyConfiguration = plainToClass(RdfOntologyConfiguration, rdfOntologiesDefinitionStructure);
const blazegraphRdfQuery = new BlazeGraphRdfQuery(rdfOntologiesDefinition, graphdb, consoleLogger);

// start the blazegraph server
// create a new directory for the blazegraph database
// grap the blazegraph jar file
//
// wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar
//
let graphDBProcess: Promise<ChildProcess> | undefined;

const blazegraphSetupProcess = spawn(`mkdir ${graphDBTestWorkingDirectory}; cd ${graphDBTestWorkingDirectory}; java -server -Xmx64g -Djetty.port=${graphDBPort} -jar /Users/jason/Downloads/blazegraph.jar`, [], { shell: true, stdio: ['pipe']});

graphDBProcess = new Promise((resolve, reject) => {
    if (blazegraphSetupProcess.stdout) {
        blazegraphSetupProcess.stdout.on('data', (data) => {
            consoleLogger.info(`stdout: ${data}`);
            // wait for the blazegraph server to start, this is determined by the string 
            //  http://[::]:${port}/blazegraph/ to get started
            // has been output!

            // var indexOf = data.search(/http:\/\/([A-Z|a-z|0-9])*:19997\/blazegraph/);
            var indexOf = data.indexOf(`:${graphDBPort}/blazegraph/ to get started`);
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

function stopGraphDBProcess() {
    execSync(`pgrep -P ${blazegraphSetupProcess.pid}`).toString().split('\n').forEach((pid) => {
        if (pid.length > 0) {
            console.log(`KILLING ${pid}`);
            execSync(`kill -9 ${pid}`);
        }
    });
    execSync(`kill -9 ${blazegraphSetupProcess.pid}`);
    execSync(`rm -rf ${graphDBTestWorkingDirectory}`);
}

export { graphDBProcess, stopGraphDBProcess, graphDBTestWorkingDirectory, graphDBPort, graphdb, blazegraphRdfQuery, rdfOntologiesDefinition };



