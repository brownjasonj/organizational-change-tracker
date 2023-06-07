import http from 'http';
import https from 'https';
import fs from 'fs';
import 'reflect-metadata';
import yargs from 'yargs';
import { ConfigurationManager } from './ConfigurationManager';
import { ApplicationConfiguration } from './models/eom/configuration/ApplicationConfiguration';
import { FrontEndConfiguration } from './models/eom/configuration/FrontEndConfiguration';
import { consoleLogger } from './logging/consoleLogger';
import { BackEndConfiguration } from './models/eom/configuration/BackEndConfiguration';
import { GraphPersistenceFactory } from './persistence/GraphPersistenceFactory';
import { FrontEndServer } from './FrontEndServer';
import { RdfGraphFactory } from './rdf/RdfGraphFactory';
import { DataIngestionPipeline } from './dataingestors/DataIngestionPipeline';
import { DataIngestionStreamStatuses } from './dataingestors/DataIngestionStreamStatuses';
import { HttpClient } from './utils/HttpClient';

// process the arg list passed to the node application
const argv = yargs(process.argv.slice(2)).options({
    config: { type: 'string'}                           // --config <path to config file> 
  }).parseSync();

// write the config file to the console
consoleLogger.info(`Loading csonfiguration file: ${argv.config}`);

// if a config file path has been passed in then load the config file
if (argv.config) {
    ConfigurationManager.getInstance().setApplicationConfigurationFromFile(argv.config);
}


// get the application configuration
const applicationConfiguration: ApplicationConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration();

/*
    Set up the back end server according to the given configuration
*/
const backEndConfiguration: BackEndConfiguration = applicationConfiguration.getBackEndConfiguration();

GraphPersistenceFactory.setBackEndConfiguration(backEndConfiguration);

/*
    Set up the front end server according to the given configuration
*/
const frontEndConfiguration: FrontEndConfiguration = applicationConfiguration.getFrontEndConfiguration();

//
// create the front end server (openapi with express) and pass the front end server a link to the backend rdf graph interface
// configured by the given configuration
//
const dataIngestionStatuses = new DataIngestionStreamStatuses();
const httpClient = new HttpClient(applicationConfiguration.getBackEndConfiguration());
const dataIngestionPipeline = new DataIngestionPipeline(RdfGraphFactory.getInstance().getOrganizationRdfGraph(), applicationConfiguration.getDataIngestionConfiguration(), dataIngestionStatuses, applicationConfiguration.getLoggingConfiguration(), httpClient);
const frontEndServer = new FrontEndServer(RdfGraphFactory.getInstance().getOrganizationRdfGraph(), dataIngestionPipeline);

if (frontEndConfiguration.isHttpsEnabled()) {
    const frontEndHttpsConfiguration = frontEndConfiguration.getHttpsConfiguration();
    if (frontEndHttpsConfiguration != null) {
        const privateKey  = fs.readFileSync(frontEndHttpsConfiguration.getHttpsKeyPath(), 'utf8');
        const certificate = fs.readFileSync(frontEndHttpsConfiguration.getHttpsCertPath(), 'utf8');
        const credentials = {key: privateKey, cert: certificate};
        const httpsServer = https.createServer(credentials, frontEndServer.getExpressServer());
        httpsServer.listen(frontEndHttpsConfiguration.getPort(), () => consoleLogger.info(`api listening at https://${frontEndConfiguration.getHostname()}:${frontEndHttpsConfiguration.getPort()}`));
    }
    else {
        consoleLogger.error(`https configuration is not defined`);
    }
}

if (frontEndConfiguration.isHttpEnabled()) {
    const frontEndHttpConfiguration = frontEndConfiguration.getHttpConfiguration();
    if (frontEndHttpConfiguration != null) {
        const httpServer = http.createServer(frontEndServer.getExpressServer());
        httpServer.listen(frontEndHttpConfiguration.getPort(), () => consoleLogger.info(`api listening at http://${frontEndConfiguration.getHostname()}:${frontEndHttpConfiguration.getPort()}`));
    }
    else {
        consoleLogger.error(`http configuration is not defined`);
    }
}


