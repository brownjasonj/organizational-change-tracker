import axios from "axios";
import http from "http";
import https from "https";
import { IRdfGraphDB, SparqlQueryResultType } from "../IRdfGraphDB";
import { BackEndConfiguration, BackEndDBConfiguration } from "../../models/eom/configuration/BackEndConfiguration";


class BlazeGraphDBOptions extends BackEndDBConfiguration {
    private namespace: string;
    private blazename: string;
    
    constructor() {
        super();
        this.namespace = 'fred';
        this.blazename = 'blazegraph';
    }

    getNamespace(): string {
        return this.namespace;
    }

    getBlazename(): string {
        return this.blazename;
    }

    getUrl(): string {
        var url: string;
        if (this.port != -1) {
            url = `${this.protocol}://${this.host}:${this.port}/${this.blazename}/${this.namespace}`;
        }
        else {
            url = `${this.protocol}://${this.host}/${this.blazename}/${this.namespace}`;
        }
        console.log("BlazeGraphDBOptions.getUrl() = " + url);
        return url;
    }

}

class BlazeGraphDB implements IRdfGraphDB {
    private options: BlazeGraphDBOptions;
    private bdc: BackEndConfiguration;
    private axios: any;
      
    constructor(bdc: BackEndConfiguration, options: BlazeGraphDBOptions) {
        console.log(`GraphdDB options : ${JSON.stringify(options)}`);
        this.options = options;
        this.bdc = bdc;
        this.axios = axios.create({
            //60 sec timeout
            timeout: 1000 * 60 * 10,
          
            //keepAlive pools and reuses TCP connections, so it's faster
            httpAgent: new http.Agent({ 
                    keepAlive: this.bdc.getHttpConfiguration().keepAlive,
                    keepAliveMsecs: this.bdc.getHttpConfiguration().keepAliveMsecs * 60 
                }),
            httpsAgent: new https.Agent({
                keepAlive: this.bdc.getHttpsConfiguration().keepAlive,
                keepAliveMsecs: this.bdc.getHttpsConfiguration().keepAliveMsecs * 60,
                rejectUnauthorized: this.bdc.getHttpsConfiguration().rejectUnauthorized,
            }),
            
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
                },
                protocol: this.options.getProtocol(),
                proxy: this.options.getProtocol() === 'https' ? this.bdc.getHttpsConfiguration().proxy : this.bdc.getHttpConfiguration().proxy
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
                protocol: this.options.getProtocol(),
                proxy: this.options.getProtocol() === 'https' ? this.bdc.getHttpsConfiguration().proxy : this.bdc.getHttpConfiguration().proxy,
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