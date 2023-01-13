import axios from "axios";

const defaultOptions = {
    host: 'localhost',
    port: 9999,
    namespace: 'sparql',
    blazename: 'blazegraph', // it was 'blazegraph' before
};

class BlazeGraphOptions {
    host: string;
    port: number;
    namespace: string;
    blazename: string;
    
    constructor(options: any) {
        this.host = options.host || defaultOptions.host;
        this.port = options.port || defaultOptions.port;
        this.namespace = options.namespace || defaultOptions.namespace;
        this.blazename = options.blazename || defaultOptions.blazename;
    }
}

enum SparqlQueryResultType {
    CSV = "text/csv",
    TSV = "text/tsv",
    JSON = "application/sparql-results+json",
    XML = "application/sparql-results+xml",
    TABLE = "application/x-binary-rdf-results-table"
  }
class BlazeGraph {
    private options: BlazeGraphOptions;
    private url: string;

      
    constructor(options: BlazeGraphOptions) {
        this.options = options;
        this.url = `http://${this.options.host}:${this.options.port}/${this.options.blazename}/${this.options.namespace}`;
    }

    async sparqlQuery(query: string, resultType: SparqlQueryResultType): Promise<any> {
        const url = `${this.url}?query=${encodeURIComponent(query)}`;
        return axios({
            method: 'get',
            url: url,
            headers: {
                'Accept': resultType
            }
        }).then((response) => {
            return new Promise((resolve, reject) => {resolve(response.data)});
        }).catch((error) => {
            return new Promise((resolve, reject) => {reject(error)});
        });
    }

    async turtleUpdate(turtle: string): Promise<any> {
        return axios({
            method: 'post',
            url: `${this.url}`,
            headers: {
                'Content-Type': 'application/x-turtle',
                'Accept': 'application/sparql-results+json'
            },
            data: turtle
        }).then((response) => {
            return new Promise((resolve, reject) => {resolve(response.data)});
        }).catch((error) => {
            return new Promise((resolve, reject) => {reject(error)});
        });
    }
}

export { BlazeGraphOptions, BlazeGraph, SparqlQueryResultType }