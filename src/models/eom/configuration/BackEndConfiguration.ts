

class BackEndHttpConfiguration {
    keepAlive: boolean;
    keepAliveMsecs: number;

    constructor() {
        this.keepAlive = true;
        this.keepAliveMsecs = 1000;
    }
}

class BackEndHttpsConfiguration extends BackEndHttpConfiguration {
    proxy: boolean;
    rejectUnauthorized: boolean;

    constructor() {
        super();
        this.proxy = false;
        this.rejectUnauthorized = false;
    }
}

class BackEndDBConfiguration {
    name: string;
    type: string;
    protocol: string;
    port : number;

    constructor() {
        this.name = 'blazegraph-http';
        this.type = 'blazegraph';
        this.protocol = 'http';
        this.port = 9999;
    }
}

class BackEndConfiguration {
    http: BackEndHttpConfiguration | null;
    https: BackEndHttpsConfiguration | null;
    graphdb: BackEndDBConfiguration[];

    constructor() {
        this.http = new BackEndHttpConfiguration();
        this.https = new BackEndHttpsConfiguration();
        this.graphdb = [new BackEndDBConfiguration()];
    }

}

export { BackEndConfiguration, BackEndDBConfiguration, BackEndHttpConfiguration, BackEndHttpsConfiguration }