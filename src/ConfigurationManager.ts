import { consoleLogger } from "./logging/consoleLogger";
import { ApplicationConfiguration, defaultApplicationConfiguration } from "./models/eom/configuration/ApplicationConfiguration";
import { ApplicationConfigurationMapperSync } from "./models/mappers/ApplicationConfigurationMapper";



class ConfigurationManager {
    private static instance: ConfigurationManager;
    private applicationConfiguration: ApplicationConfiguration;

    constructor() {
        this.applicationConfiguration = defaultApplicationConfiguration;
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

    public setApplicationConfigurationFromFile(configFile: string): ApplicationConfiguration {
        this.applicationConfiguration = ApplicationConfigurationMapperSync(configFile);
        consoleLogger.info(`Application Configuration: ${JSON.stringify(this.applicationConfiguration)}`);
        return this.applicationConfiguration;
    }
}

export { ConfigurationManager };