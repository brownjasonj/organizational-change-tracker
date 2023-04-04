import axios from "axios";
import http from "http";
import https from "https";
import { IRdfGraphDB, SparqlQueryResultType } from "../IRdfGraphDB";

const defaultOptions = {
    protocol: 'http',
    host: 'localhost',
    port: '9999',
    namespace: 'sparql',
    blazename: 'blazegraph', // it was 'blazegraph' before
};

class BlazeGraphDBOptions {
    private protocol: string;
    private host: string;
    private port: string;
    private namespace: string;
    private blazename: string;
    private url: string;
    
    constructor(options: any) {
        this.protocol = options.protocol || defaultOptions.protocol;
        this.host = options.host || defaultOptions.host;
        this.port = options.port || defaultOptions.port;
        this.namespace = options.namespace || defaultOptions.namespace;
        this.blazename = options.blazename || defaultOptions.blazename;
        if (this.port != '') {
            this.url = `${this.protocol}://${this.host}:${this.port}/${this.blazename}/${this.namespace}`;
        }
        else {
            this.url = `${this.protocol}://${this.host}/${this.blazename}/${this.namespace}`;
        }
    }

    getHost(): string {
        return this.host;
    }

    getPort(): string {
        return this.port;
    }

    getNamespace(): string {
        return this.namespace;
    }

    getBlazename(): string {
        return this.blazename;
    }

    getUrl(): string {
        console.log("BlazeGraphDBOptions.getUrl() = " + this.url);
        return this.url;
    }

}


class BlazeGraphDB implements IRdfGraphDB {
    private options: BlazeGraphDBOptions;
    private axios: any;
      
    constructor(options: BlazeGraphDBOptions) {
        this.options = options;
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
        const url = `${this.options.getUrl()}?query=${encodeURIComponent(query)}`;
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
                url: `${this.options.getUrl()}`,
                headers: {
                    'Content-Type': 'application/x-turtle',
                    'Accept': 'application/json'
                },
                data: turtle
            }).then((response: { data: unknown; }) => {
                resolve(response.data);
            }).catch((error: any) => {
                reject(error);
            });
        });
    }

    async deleteAllTriple(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.axios({
                method: 'delete',
                url: `${this.options.getUrl()}`,
                headers: {
                    'Accept': 'application/json'
                }
            }).then((response: { data: unknown; }) => {
                resolve(response.data);
            }).catch((error: any) => {
                reject(error);
            });
        });
     }

}

export { BlazeGraphDBOptions, BlazeGraphDB }