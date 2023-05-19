import axios from "axios";
import http from "http";
import https from "https";
import { BackEndConfiguration } from "../models/eom/configuration/BackEndConfiguration";


class HttpClient {
    private bdc: BackEndConfiguration;
    private axios: any;
      
    constructor(bdc: BackEndConfiguration) {
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

    public async post(requestedUrl: string, dataBody: any, requestHeaders: Object, secureRequest: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.axios({
                method: 'POST',
                url: requestedUrl,
                headers: requestHeaders,
                protocol: secureRequest ? 'https' : 'http',
                proxy: secureRequest ? this.bdc.getHttpsConfiguration().proxy : this.bdc.getHttpConfiguration().proxy,
                data: dataBody})
            .then((response: { data: any; }) => {
                resolve(response.data);
            }).catch((error: any) => {
                reject(error);
            })
        });
    }
    public async get(requestedUrl: string, requestHeaders: Object, secureRequest: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.axios({
                method: 'GET',
                url: requestedUrl,
                headers: requestHeaders,
                protocol: secureRequest ? 'https' : 'http',
                proxy: secureRequest ? this.bdc.getHttpsConfiguration().proxy : this.bdc.getHttpConfiguration().proxy,
                })
            .then((response: { data: any; }) => {
                resolve(response);
            }).catch((error: any) => {
                reject(error);
            })
        });
    }
}

export { HttpClient }