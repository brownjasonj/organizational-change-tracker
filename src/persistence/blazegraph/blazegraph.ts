import axios from "axios";
import http from "http";
import https from "https";
import { IRdfGraphDB, SparqlQueryResultType } from "../../interfaces/IRdfGraphDB";

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


class BlazeGraph implements IRdfGraphDB {
    private options: BlazeGraphOptions;
    private url: string;
    private axios: any;

      
    constructor(options: BlazeGraphOptions) {
        this.options = options;
        this.url = `http://${this.options.host}:${this.options.port}/${this.options.blazename}/${this.options.namespace}`;
        this.axios = axios.create({
            //60 sec timeout
            timeout: 1000 * 60 * 10,
          
            //keepAlive pools and reuses TCP connections, so it's faster
            httpAgent: new http.Agent({ keepAlive: true, keepAliveMsecs: 1000 * 60 }),
            httpsAgent: new https.Agent({ keepAlive: true, keepAliveMsecs: 1000 * 60 }),
            
            //follow up to 10 HTTP 3xx redirects
            maxRedirects: 10,
            
            //cap the maximum content length we'll accept to 50MBs, just in case
            maxContentLength: 50 * 1000 * 1000
          });
    }

    async sparqlQuery(query: string, resultType: SparqlQueryResultType): Promise<any> {
        const url = `${this.url}?query=${encodeURIComponent(query)}`;
        return new Promise((resolve, reject) => {
            this.axios({
                method: 'get',
                url: url,
                headers: {
                    'Accept': resultType
                }
            }).then((response: { data: any; }) => {
                resolve(response.data);
            }).catch((error: any) => {
                reject(error);
            })
        });
    }

    async turtleUpdate(turtle: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.axios({
                method: 'post',
                url: `${this.url}`,
                headers: {
                    'Content-Type': 'application/x-turtle',
                    'Accept': 'application/sparql-results+json'
                },
                data: turtle
            }).then((response: { data: unknown; }) => {
                resolve(response.data);
            }).catch((error: any) => {
                reject(error);
            });
        });
    }
}

export { BlazeGraphOptions, BlazeGraph, SparqlQueryResultType }