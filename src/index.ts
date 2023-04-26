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
import { employeeCountByDepartmentCodeHandler } from './handlers/employeeCountByDepartmentCodeHandler';
import { departmentCodesHandler } from './handlers/departmentCodesHandler';
import { departmentHistoryHandler } from './handlers/departmentHistoryHandler';
import { employeeRoleHistoryHandler } from './handlers/employeeRoleHistoryHandler';
import { employeeDepartmentHistoryHandler } from './handlers/employeeDepartmentHistoryHandler';
import fileUpload from 'express-fileupload';
import { operationsLoadStatusHandler } from './handlers/operationsLoadStatusHandler';
import { addEmployeesHandler } from './handlers/addEmployessHandler';
import { ConfigurationManager } from './ConfigurationManager';
import { employeeJoinersByDepartment } from './handlers/employeeJoinersByDepartment';
import { employeeLeaversByDepartment } from './handlers/employeeLeaversByDepartment';
import { departmentHistoryWithJoinersLeaversHandler } from './handlers/departmentHistoryWithJoinersLeaversHandler';
import { operationsDeleteTriplesHandler } from './handlers/operationsDeleteHandler';
import { addEmployeeRecordHandler } from './handlers/addEmployeeRecordHandler';
import { validationFailHandler } from './handlers/validationFailHandler';
import { notFoundHandler } from './handlers/notFoundHandler';
import { notImplementedHandler } from './handlers/notImplementedHandler';
import { testHandler } from './handlers/testHandler';
import yargs from 'yargs';
import { operationsGetConfiguration } from './handlers/operationsGetConfiguration';
import { ApplicationConfiguration } from './models/eom/configuration/ApplicationConfiguration';
import { FrontEndConfiguration } from './models/eom/configuration/FrontEndConfiguration';
import PinoHttp from 'pino-http';
import { consoleLogger } from './logging/consoleLogger';

  

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

const openApiDocumentPath = './openapi-schemas/organizational-changes-openapi.yaml';

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
api.register('test', testHandler);
api.register('addemployeeGet', addEmployeeRecordHandler);
api.register('addemployeesPost', addEmployeesHandler);
api.register('employeeDepartmentHistory', employeeDepartmentHistoryHandler);
api.register('employeeRoleHistory', employeeRoleHistoryHandler);
api.register('departmentHistoryWithJoinersLeaver', departmentHistoryWithJoinersLeaversHandler);
api.register('departmentJoiners', employeeJoinersByDepartment);
api.register('departmentLeavers', employeeLeaversByDepartment);
api.register('employee-count-by-department-code', employeeCountByDepartmentCodeHandler);
api.register('department-codes', departmentCodesHandler);
api.register('departmentHistory', departmentHistoryHandler);
api.register('upload', addEmployeesHandler);
api.register('operationsLoadingStatus', operationsLoadStatusHandler);
api.register('operationsDeleteTriples', operationsDeleteTriplesHandler);
api.register('operationsGetConfiguration', operationsGetConfiguration);

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

