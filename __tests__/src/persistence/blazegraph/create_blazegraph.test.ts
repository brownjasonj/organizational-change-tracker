import { ChildProcess, exec } from "child_process"
import {v4 as uuidv4} from 'uuid';
import { BlazeGraphDB,BlazeGraphDBOptions } from "../../../../src/persistence/blazegraph/BlazeGraphDB";
import { IRdfGraphDB, SparqlQueryResultType } from "../../../../src/persistence/IRdfGraphDB";
import { BackEndConfiguration, BackEndDBConfiguration } from "../../../../src/models/eom/configuration/BackEndConfiguration";
import { plainToClass } from "class-transformer";
import 'reflect-metadata';

describe("create a new blazegraph DB", () => {
    let testDirectory: string;
    let blazegraphProcess: ChildProcess;

    beforeAll(() => {
        const myuuid = uuidv4();
        testDirectory = `blazegraph-test-database-${myuuid}`;
        blazegraphProcess = exec(`mkdir ${testDirectory};
                    cd ${testDirectory};
                    wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar;
                    java -server -Xmx64g -Djetty.port=19999 -jar blazegraph.jar&`);    
    });

    afterAll(() => {
        if (blazegraphProcess.kill()) {
            exec(`rm -rf ${testDirectory}`);
        }
    });

    test("create a new blazegraph DB", async () => {
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

        console.log(`backEndConfiguration: ${JSON.stringify(backEndConfiguration)}`);
        // console.log(`blazegraphDBOptions: ${JSON.stringify(backEndConfiguration.getGraphDBConfiguration(testDBConfigurationName))}`);
        console.log(`blazegraphDBOptions: ${JSON.stringify(blazegraphDBOptions)}`);
        

         // To use the BlazeGraph, uncomment the following line and comment out the OnToTextGraphDB line
        const graphdb: IRdfGraphDB = new BlazeGraphDB(backEndConfiguration, blazegraphDBOptions);

        const query = `prefix bank-org: <http://example.org/bank-org#>
    prefix bank-id: <http://example.org/bank-id#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select  distinct ?employee ?corpTitle ?startDate ?endDate
	where {
        ?employee rdf:type bank-org:BankEmployee.
		?corpTitleMembership org:member ?employee.
        ?employee bank-id:id "e10".
        ?corpTitleMembership bank-org:BankCorporateTitle ?corpTitle.
        {
            optional {
              select ?corpTitleMembership (min(?date1) as ?startDate) (max(?date2) as ?endDate)
              where {
                    ?corpTitleMembership org:memberDuring ?interval.			# determine when the member was a member of the organization
                    ?interval time:hasBeginning ?start.
                    ?interval time:hasEnd ?end.
                    ?start time:inXSDDateTimeStamp ?date1.
                      ?end time:inXSDDateTimeStamp ?date2.
              }
              group by ?corpTitleMembership ?org ?startDate ?endDate
           } 
          }
    }`;

        try {
            const result = await graphdb.sparqlQuery(query, SparqlQueryResultType.JSON);
            console.log(result);
        }
        catch (err) {
            console.log(err);
        }
        expect(true).toBe(true);
    });
    }
);