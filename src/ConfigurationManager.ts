class Configuration {
    private httpsPort: number;
    private httpPort: number;
    private httpsKeyPath: string;
    private httpsCertPath: string;
    private enableHttps: boolean;
    private streamTrottleTimeout: number;

    constructor() {
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