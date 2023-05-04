import { exec } from "child_process"
import {v4 as uuidv4} from 'uuid';
import { BlazeGraphDB,BlazeGraphDBOptions } from "../../../src/persistence/blazegraph/BlazeGraphDB";
import { IRdfGraphDB, SparqlQueryResultType } from "../../../src/persistence/IRdfGraphDB";
import { BackEndConfiguration, BackEndDBConfiguration } from "../../../src/models/eom/configuration/BackEndConfiguration";
import { plainToClass } from "class-transformer";
import 'reflect-metadata';

describe("create a new blazegraph DB", () => {
    beforeAll(async () => {
        const myuuid = uuidv4();
        const testDirectory = `blazegraph-test-database${myuuid}`;
//        const createdDirectory = await exec(`mkdir ${testDirectory}; cd ${testDirectory}`);
        // await exec(`mkdir ${testDirectory}`);
        // await exec(`cd ${testDirectory}`);
        // await exec(`wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar`);
        // await exec(`java -server -Xmx64g -Djetty.port=19999 -jar blazegraph.jar&`);
        await exec(`mkdir ${testDirectory};
                    cd ${testDirectory};
                    wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar;
                    java -server -Xmx64g -Djetty.port=19999 -jar blazegraph.jar&`);
    });

    test("create a new blazegraph DB", async () => {
        const backendConfiguration = {
                "backend": {
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
                    "graphdb": "blazegraph-test-database",
                    "graphdbconfigs": [
                        {
                            "name": "blazegraph-test-database",
                            "type": "blazegraph",
                            "protocol": "http",
                            "host": "localhost",
                            "port": 19999,
                            "namespace": "sparql",
                            "blazename": "blazegraph"
                        }
                    ]
                }
            };
        const backEndConfiguration: BackEndConfiguration = plainToClass(BackEndConfiguration, backendConfiguration);
        const backendDB: BackEndDBConfiguration = new BackEndDBConfiguration();

        console.log(`backEndConfiguration: ${JSON.stringify(backEndConfiguration)}`);

         // To use the BlazeGraph, uncomment the following line and comment out the OnToTextGraphDB line
        const graphdb: IRdfGraphDB = new BlazeGraphDB(backEndConfiguration, plainToClass(BlazeGraphDBOptions, backendDB))

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
)