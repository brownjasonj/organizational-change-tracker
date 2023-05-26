import cors from 'cors';
import Express from 'express';
import http from 'http';
import https from 'https';
import morgan from 'morgan';
import fs from 'fs';
import { OpenAPIBackend, Request } from 'openapi-backend';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import 'reflect-metadata';
import yargs from 'yargs';
import { departmentCodesAsOfDateHandler } from './handlers/departmentCodesAsOfDateHandler';
import { corporateTitleHistoryByEmployeeIdHandler } from './handlers/corporateTitleHistoryByEmployeeIdHandler';
import fileUpload from 'express-fileupload';
import { operationsFileUploadStatusByRequestIdHandler } from './handlers/operationsFileUploadStatusByRequestIdHandler';
import { uploadEmployeesByFileHandler } from './handlers/uploadEmployeesByFileHandler';
import { ConfigurationManager } from './ConfigurationManager';
import { employeesJoiningByDepartmentCodeFromDateToDateHandler } from './handlers/employeesJoiningByDepartmentCodeFromDateToDateHandler';
import { employeesLeavingByDepartmentCodeFromDateToDateHandler } from './handlers/employeesLeavingByDepartmentCodeFromDateToDateHandler';
import { operationsDeleteTriplesHandler } from './handlers/operationsDeleteHandler';
import { validationFailHandler } from './handlers/validationFailHandler';
import { notFoundHandler } from './handlers/notFoundHandler';
import { notImplementedHandler } from './handlers/notImplementedHandler';
import { operationsGetConfiguration } from './handlers/operationsGetConfiguration';
import { ApplicationConfiguration } from './models/eom/configuration/ApplicationConfiguration';
import { FrontEndConfiguration } from './models/eom/configuration/FrontEndConfiguration';
import { consoleLogger } from './logging/consoleLogger';
import { departmentHistoryByEmployeeIdHandler } from './handlers/departmentHistoryByEmployeeIdHandler';
import { employeeByEmployeeIdHandler } from './handlers/idhandlers/employeeByEmployeeIdHandler';
import { membershipByMembershipIdHandler } from './handlers/idhandlers/membershipByMembershipIdHandler';
import { organizationByOrganizationIdHandler } from './handlers/idhandlers/organizationByOrganizationIdHandler';
import { timeByTimeIdHandler } from './handlers/idhandlers/timeByTimeIdHandler';
import { timeIntervalByTimeIntervalIdHandler } from './handlers/idhandlers/timeIntervalByTimeIntervalIdHandler';
import { BackEndConfiguration } from './models/eom/configuration/BackEndConfiguration';
import { GraphPersistenceFactory } from './persistence/GraphPersistenceFactory';
import { employeeByEmployeeSystemIdHandler } from './handlers/idhandlers/employeeByEmployeeSystemIdHandler';
import { operationsFilesUploadStatusesHandler } from './handlers/operationsFilesUploadStatusesHandler';
import { employeeCountByDepartmentCodeAsOfDateHandler } from './handlers/employeeCountByDepartmentCodeAsOfDateHandler';
import { employeeCountByDepartmentCodeFromDateToDateHandler } from './handlers/employeeCountByDepartmentCodeFromDateToDateHandler';
import { employeesJoiningLeavingByDepartmentCodeFromDateToDateHandler } from './handlers/employeesJoiningLeavingByDepartmentCodeFromDateToDateHandler';

const app = Express();
// enable file uploads
app.use(fileUpload({
    createParentPath: true
}));

// extende the size of body requests
app.use(Express.json({ limit: '200mb' }));

// enable cors
app.use(cors({
    origin: 'http://localhost:3000',
}));

const openApiDocumentPath = './openapi-schemas/organizational-change-openapi.yaml';

// create api with your definition file or object
const api = new OpenAPIBackend({ 
    definition: openApiDocumentPath
});

// register the swagger-ui
const swaggerDocument = YAML.load(openApiDocumentPath);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// register default handlers
api.register('validationFail', validationFailHandler);
api.register('notFound', notFoundHandler);
api.register('notImplemented', notImplementedHandler);

// register openapi application handlers
api.register('employeeByEmployeeId', employeeByEmployeeIdHandler);
api.register('corporateTitleHistoryByEmployeeId', corporateTitleHistoryByEmployeeIdHandler);
api.register('departmentHistoryByEmployeeId', departmentHistoryByEmployeeIdHandler);

api.register('employeeCountByDepartmentCodeAsOfDate', employeeCountByDepartmentCodeAsOfDateHandler);
api.register('employeeCountByDepartmentCodeFromDateToDate', employeeCountByDepartmentCodeFromDateToDateHandler);
api.register('employeesJoiningLeavingByDepartmentCodeFromDateToDate', employeesJoiningLeavingByDepartmentCodeFromDateToDateHandler);
api.register('employeesJoiningByDepartmentCodeFromDateToDate', employeesJoiningByDepartmentCodeFromDateToDateHandler);
api.register('employeesLeavingByDepartmentCodeFromDateToDate', employeesLeavingByDepartmentCodeFromDateToDateHandler);


api.register('departmentCodesAsOfDate', departmentCodesAsOfDateHandler);
api.register('uploadEmployeesByFile', uploadEmployeesByFileHandler);
api.register('operationsFileUploadStatusByRequestId', operationsFileUploadStatusByRequestIdHandler);
api.register('operationsFilesUploadStatuses', operationsFilesUploadStatusesHandler)
api.register('operationsDeleteTriples', operationsDeleteTriplesHandler);
api.register('operationsGetConfiguration', operationsGetConfiguration);
api.register('employeeByEmployeeSystemId', employeeByEmployeeSystemIdHandler)
api.register('membershipByMembershipId', membershipByMembershipIdHandler);
api.register('organizationByOrganizationId', organizationByOrganizationIdHandler);
api.register('timeByTimeId', timeByTimeIdHandler);
api.register('timeIntervalByTimeIntervalId', timeIntervalByTimeIntervalIdHandler);

// register mock handlers
//api.mockResponseForOperation('test');


// initalize the backend
api.init();


// logging
app.use(morgan('combined'));
// app.use(PinoHttp);

// use as express middleware to pick-up requests and send to the openapi-backend handler.
app.use((req, res) => api.handleRequest(req as Request, req, res));

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

if (frontEndConfiguration.isHttpsEnabled()) {
    const frontEndHttpsConfiguration = frontEndConfiguration.getHttpsConfiguration();
    if (frontEndHttpsConfiguration != null) {
        const privateKey  = fs.readFileSync(frontEndHttpsConfiguration.getHttpsKeyPath(), 'utf8');
        const certificate = fs.readFileSync(frontEndHttpsConfiguration.getHttpsCertPath(), 'utf8');
        const credentials = {key: privateKey, cert: certificate};
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(frontEndHttpsConfiguration.getPort(), () => consoleLogger.info(`api listening at https://${frontEndConfiguration.getHostname()}:${frontEndHttpsConfiguration.getPort()}`));
    }
    else {
        consoleLogger.error(`https configuration is not defined`);
    }
}

if (frontEndConfiguration.isHttpEnabled()) {
    const frontEndHttpConfiguration = frontEndConfiguration.getHttpConfiguration();
    if (frontEndHttpConfiguration != null) {
        const httpServer = http.createServer(app);
        httpServer.listen(frontEndHttpConfiguration.getPort(), () => consoleLogger.info(`api listening at http://${frontEndConfiguration.getHostname()}:${frontEndHttpConfiguration.getPort()}`));
    }
    else {
        consoleLogger.error(`http configuration is not defined`);
    }
}

