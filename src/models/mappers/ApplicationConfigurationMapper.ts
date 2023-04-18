import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { ApplicationConfiguration, defaultApplicationConfiguration } from "../eom/configuration/ApplicationConfiguration";
import { deserialize, plainToClass, plainToClassFromExist } from 'class-transformer';

const ApplicationConfigurationMapperSync = (configFilePath: string): ApplicationConfiguration => {
    const configJsonData = fs.readFileSync(configFilePath, { encoding: 'utf8' });
    const config: ApplicationConfiguration = deserialize(ApplicationConfiguration, configJsonData);
    if (config != null) {
        console.log(`Application Configuration: ${JSON.stringify(config)}`);
        return config;
    }
    else {
        console.log(`Default Application Configuration: ${JSON.stringify(defaultApplicationConfiguration)}`);
        return defaultApplicationConfiguration;
    }
}

export { ApplicationConfigurationMapperSync }