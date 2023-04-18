import { Type } from "class-transformer";


class BackEndHttpConfiguration {
    keepAlive: boolean;
    keepAliveMsecs: number;
    proxy: boolean;
    rejectUnauthorized: boolean;

    constructor() {
        this.keepAlive = true;
        this.keepAliveMsecs = 1000;
        this.proxy = false;
        this.rejectUnauthorized = false;
    }
}

class BackEndHttpsConfiguration extends BackEndHttpConfiguration {
    keyPath: string;
    certPath: string;

    constructor() {
        super();
        this.keyPath = "/etc/letsencrypt/live/yourdomain.com/privkey.pem",
        this.certPath = "/etc/letsencrypt/live/yourdomain.com/fullchain.pem"
    }
}

class BackEndDBConfiguration {
    name: string;
    type: string;
    protocol: string;
    host: string;
    port : number;

    constructor() {
        this.name = 'blazegraph-http';
        this.type = 'blazegraph';
        this.protocol = 'http';
        this.host = 'localhost';
        this.port = 9999;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }

    public getProtocol(): string {
        return this.protocol;
    }

    public getHost(): string {
        return this.host;
    }

    public getPort(): number {
        return this.port;
    }
}


class BackEndConfiguration {
    @Type(() => BackEndHttpConfiguration)
    http: BackEndHttpConfiguration;
    @Type(() => BackEndHttpsConfiguration)
    https: BackEndHttpsConfiguration;
    @Type(() => BackEndDBConfiguration)
    graphdbconfigs: BackEndDBConfiguration[];
    graphdb: string;

    constructor() {
        this.http = new BackEndHttpConfiguration();
        this.https = new BackEndHttpsConfiguration();
        this.graphdbconfigs = [];
        this.graphdb = 'blazegraph-https';
    }

    public getHttpConfiguration(): BackEndHttpConfiguration {
        return this.http;
    }

    public getHttpsConfiguration(): BackEndHttpsConfiguration{
        return this.https;
    }

    public getGraphDB(): string {
        return this.graphdb;
    }

    public getGraphDBConfiguration(configName: string): BackEndDBConfiguration | undefined {
        var selectedConfig: BackEndDBConfiguration | undefined = undefined;
        this.graphdbconfigs.forEach((config) => {
            if (config.getName() === configName) {
                selectedConfig = config;
            }
        });
        return selectedConfig;
    }

}

export { BackEndConfiguration, BackEndDBConfiguration, BackEndHttpConfiguration, BackEndHttpsConfiguration }