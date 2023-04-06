

const defaultPath = '../config/application-config.json';

class FrontEndHttpsConfiguration {
    port: number;
    httpsKeyPath: string;
    httpsCertPath: string;

    constructor(port: number, httpsKeyPath: string, httpsCertPath: string) {
        this.port = port;
        this.httpsKeyPath = httpsKeyPath;
        this.httpsCertPath = httpsCertPath;
    }
}

class FrontEndHttpConfiguration {
    port: number;

    constructor(port: number) {
        this.port = port;
    }
}
class FrontEndConfiguration {
    hostname: string;
    enableHttps: boolean;
    enableHttp: boolean;
    https: FrontEndHttpsConfiguration;
    http: FrontEndHttpConfiguration;
    streamTrottleTimeoutMs: number;

    constructor(hostname: string, enableHttps: boolean, enableHttp: boolean, https: FrontEndHttpsConfiguration, http: FrontEndHttpConfiguration, streamTrottleTimeoutMs: number) {
        this.hostname = hostname;
        this.enableHttps = enableHttps;
        this.enableHttp = enableHttp;
        this.https = https;
        this.http = http;
        this.streamTrottleTimeoutMs = streamTrottleTimeoutMs;
    }

}

class Configuration {
    private static instance: Configuration;
    private httpsPort: number;
    private httpPort: number;
    private httpsKeyPath: string;
    private httpsCertPath: string;
    private enableHttps: boolean;
    private streamTrottleTimeout: number;

    constructor(configfFile?: string) {
        this.enableHttps = false;
        this.httpsPort = 8443;
        this.httpPort = 8080;
        this.httpsKeyPath = '/Users/jason/tmp/sslcert/key.pem';
        this.httpsCertPath = '/Users/jason/tmp/sslcert/cert.pem';
        this.streamTrottleTimeout = 20;
    }

    public getHttpsPort(): number {
        return this.httpsPort;
    }

    public getHttpPort(): number {
        return this.httpPort;
    }

    public getHttpsKeyPath(): string {
        return this.httpsKeyPath;
    }

    public getHttpsCertPath(): string {
        return this.httpsCertPath;
    }

    public isHttpsEnabled(): boolean {
        return this.enableHttps;
    }

    public getStreamTrottleTimeoutMs(): number {
        return this.streamTrottleTimeout;
    }
}

class ConfigurationManager {
    private static instance: ConfigurationManager;
    private confguration;

    private constructor() {
        this.confguration = new Configuration();
    }

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    public getConfiguration(): Configuration {
        return this.confguration;
    }
}

export { ConfigurationManager, Configuration };