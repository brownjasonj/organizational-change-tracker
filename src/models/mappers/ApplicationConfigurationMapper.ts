import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { ApplicationConfiguration, defaultApplicationConfiguration } from "../eom/configuration/ApplicationConfiguration";

const ApplicationConfigurationMapper = (configFilePath: string): ApplicationConfiguration => {
    const stream = fs.createReadStream(configFilePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    var config: ApplicationConfiguration;
    stream.pipe(parser).on('data', (data: ApplicationConfiguration) => {
        console.log(`Application Configuration: ${data}`);
    }).on('end', () => {
        console.log('end');
    });
    return defaultApplicationConfiguration;
}

export { ApplicationConfigurationMapper }