import { ApplicationConfiguration } from "./models/eom/configuration/ApplicationConfiguration";
import { ApplicationConfigurationMapper } from "./models/mappers/ApplicationConfigurationMapper";


const defaultPath = './config/application-config.json';

class ConfigurationManager {
    private static instance: ConfigurationManager;
    private applicationConfiguration: ApplicationConfiguration;

    constructor(configFile?: string) {
        this.applicationConfiguration = ApplicationConfigurationMapper(configFile || defaultPath);
    }

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    public getApplicationConfiguration(): ApplicationConfiguration {
        return this.applicationConfiguration;
    }
}

export { ConfigurationManager };