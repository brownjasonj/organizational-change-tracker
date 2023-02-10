import { IRdfGraphDB } from "../../interfaces/IRdfGraphDB";
import { EnapsoGraphDBClient } from "@innotrade/enapso-graphdb-client";

// connection data to the run GraphDB instance
const GRAPHDB_BASE_URL = "http://localhost:7200",
    GRAPHDB_REPOSITORY = "organization",
    GRAPHDB_USERNAME = "test",
    GRAPHDB_PASSWORD = "test",
    GRAPHDB_CONTEXT_TEST = "http://example.org/#";

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: "bank-id",
        iri: "http://example.org/#",
    }
];

class GraphDB implements IRdfGraphDB {
    private graphDBEndpoint: any;

    constructor() {
        this.graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
            baseURL: GRAPHDB_BASE_URL,
            repository: GRAPHDB_REPOSITORY,
            prefixes: DEFAULT_PREFIXES,
            format: EnapsoGraphDBClient.FORMAT_TURTLE
        });

        // connect and authenticate
        
    }

    async init() {
        await this.graphDBEndpoint.login(GRAPHDB_USERNAME,GRAPHDB_PASSWORD)
        .then((result: any) => {
            console.log(result);
        }).catch((err: any) => {
            console.log(err);
        });
    }

    async turtleUpdate(turtle: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.graphDBEndpoint.update(`insert data {${turtle}}`, GRAPHDB_CONTEXT_TEST)
            .then((result: any) => {
                console.log("inserted a class :\n" + JSON.stringify(result, null, 2));
                resolve(result);
            }).catch((err: any) => {
                console.log(err);
                reject(err);
            })
        });
    }

    async sparqlQuery(query: string, resultType: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.graphDBEndpoint.query(query)
            .then((result: any) =>{
                resolve(result);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }
}

export { GraphDB };