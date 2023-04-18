import { Type } from "class-transformer";

const defaultHostname = 'localhost';
const defaultEnableHttps = false;
const defaultEnableHttp = true;
const defaultHttpPort = 8080;
const defaultStreamTrottleTimeoutMs = 1000;


class FrontEndHttpConfiguration {
    port: number;

    constructor(port: number) {
        this.port = port;
    }

    public getPort(): number {
        return this.port;
    }
}

class FrontEndHttpsConfiguration extends FrontEndHttpConfiguration {
    httpsKeyPath: string;
    httpsCertPath: string;

    constructor(port: number, httpsKeyPath: string, httpsCertPath: string) {
        super(port);
        this.httpsKeyPath = httpsKeyPath;
        this.httpsCertPath = httpsCertPath;
    }

    public getHttpsKeyPath(): string {
        return this.httpsKeyPath;
    }

    public getHttpsCertPath(): string {
        return this.httpsCertPath;
    }
}

class FrontEndConfiguration {
    hostname: string;
    enableHttps: boolean;
    enableHttp: boolean;
    @Type(() => FrontEndHttpsConfiguration)
    https: FrontEndHttpsConfiguration | null;
    @Type(() => FrontEndHttpConfiguration)
    http: FrontEndHttpConfiguration;
    streamTrottleTimeoutMs: number;

    constructor() {
        this.hostname = defaultHostname;
        this.enableHttps = defaultEnableHttps;
        this.enableHttp = defaultEnableHttp;
        this.https = null;
        this.http = new FrontEndHttpConfiguration(defaultHttpPort);
        this.streamTrottleTimeoutMs = defaultStreamTrottleTimeoutMs;
    }

    public isHttpsEnabled(): boolean {
        return this.enableHttps;
    }

    public isHttpEnabled(): boolean {
        return this.enableHttp;
    }

    public getHostname(): string {
        return this.hostname;
    }

    public getHttpsConfiguration(): FrontEndHttpsConfiguration | null {
        return this.https;
    }

    public getHttpConfiguration(): FrontEndHttpConfiguration {
        return this.http;
    }

    public getStreamTrottleTimeoutMs(): number {
        return this.streamTrottleTimeoutMs;
    }
}

export { FrontEndConfiguration, FrontEndHttpConfiguration, FrontEndHttpsConfiguration}