import Module from "node:module";
const require = Module.createRequire(import.meta.url);
import { IRdfGraphDB, SparqlQueryResultType } from "../../interfaces/IRdfGraphDB";
const {GraphDBServerClient, ServerClientConfig } = require('graphdb').server;
const {RepositoryClientConfig, RDFRepositoryClient} = require('graphdb').repository;
const {RDFMimeType} = require('graphdb').http;


// connection data to the run GraphDB instance
const GRAPHDB_BASE_URL = "http://localhost:7200",
    GRAPHDB_REPOSITORY = "organization",
    GRAPHDB_USERNAME = "test",
    GRAPHDB_PASSWORD = "test",
    GRAPHDB_CONTEXT_TEST = "http://example.org";
const readTimeout = 30000;
const writeTimeout = 30000;


class OnToTextGraphDB implements IRdfGraphDB {
    private serverClientConfig: any;
    private serverClient: any;
    private repositoryClientConfig: any;
    private rdfRespositoryClient: any;

    constructor() {
        this.serverClientConfig = new ServerClientConfig(GRAPHDB_BASE_URL)
                .useGdbTokenAuthentication(GRAPHDB_USERNAME, GRAPHDB_PASSWORD);
        // Instance the server client
        this.serverClient = new GraphDBServerClient(this.serverClientConfig);
        this.repositoryClientConfig = new RepositoryClientConfig(GRAPHDB_BASE_URL)
                //.setRepository(GRAPHDB_REPOSITORY)
                .setEndpoints([`${GRAPHDB_BASE_URL}/repositories/${GRAPHDB_REPOSITORY}`])
                .setHeaders({
                  'Accept': RDFMimeType.TURTLE
                })
                .setReadTimeout(readTimeout)
                .setWriteTimeout(writeTimeout);
        this.rdfRespositoryClient = new RDFRepositoryClient(this.repositoryClientConfig)
    }

    destroy() {
    }

    async sparqlQuery(query: string, resultType: SparqlQueryResultType): Promise<any> {
    }
    
    async turtleUpdate(turtle: string): Promise<any>{
        const contentType = RDFMimeType.TURTLE;
        return new Promise((resolve, reject) => {
            this.rdfRespositoryClient.upload(turtle, contentType, GRAPHDB_CONTEXT_TEST)
            .then((result: any) => {
                resolve(turtle);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}

export { OnToTextGraphDB }