import pino, { Logger } from 'pino';
import { LoggingConfiguration } from '../models/eom/configuration/LoggingConfiguration';
import { dateIdGenerator } from '../utils/dateIdGenerator';

function createSparqlQueryLogger(configuration: LoggingConfiguration): Logger {
    if (configuration.getQueryLogging()) {
        if (configuration.getQueryLoggingPath() == '') {
            // if logging is on, but not path given to store logs then write to stdout
            return pino({
                transport: {
                pipeline: [{
                    target: './pinoPipelineTransport.js'
                }, {
                    target: 'pino-pretty'
                }]
                }
            });
        }
        else {
            // otherwise write to file
            return pino({
                transport: {
                pipeline: [{
                    target: './pinoPipelineTransport.js'
                }, {
                    // Use target: 'pino/file' to write to stdout
                    // without any change.
                    target: 'pino/file',
                    options: { destination: `${configuration.getQueryLoggingPath()}/queries-${dateIdGenerator(new Date())}.json`, mkdir: true, append: true }
                }]
                }
            });
        }
    }
    else {
        // if logging is off, then return a no-op logger
        return pino({
            transport: {
                pipeline: [{
                    target: './pinoPipelineTransport.js'
                }, {
                    target: 'pino/file',
                    options: { destination: '/dev/null' }
                }]
            }
        });    
    }
}

export { createSparqlQueryLogger };