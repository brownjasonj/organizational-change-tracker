import cors from 'cors';
import Express from 'express';
import http from 'http';
import https from 'https';
import morgan from 'morgan';
import fs from 'fs';
import { OpenAPIBackend, Request } from 'openapi-backend';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {addEmployeeRecordHandler} from './handlers/addEmployeeRecordHandler';
import notFoundHandler from './handlers/notFoundHandler';
import notImplementedHandler from './handlers/notImplementedHandler';
import testHandler from './handlers/testHandler';
import validationFailHandler from './handlers/validationFailHandler';
import { employeeCountByDepartmentCodeHandler } from './handlers/employeeCountByDepartmentCodeHandler';
import { departmentCodesHandler } from './handlers/departmentCodesHandler';
import { departmentHistoryHandler } from './handlers/departmentHistoryHandler';
import { employeeRoleHistoryHandler } from './handlers/employeeRoleHistoryHandler';
import { employeeDepartmentHistoryHandler } from './handlers/employeeDepartmentHistoryHandler';
import fileUpload from 'express-fileupload';
import { operationsLoadStatusHandler } from './handlers/operationsLoadStatusHandler';
import { addEmployeesHandler } from './handlers/addEmployessHandler';

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
api.register('employee-count-by-department-code', employeeCountByDepartmentCodeHandler);
api.register('department-codes', departmentCodesHandler);
api.register('departmentHistory', departmentHistoryHandler);
api.register('upload', addEmployeesHandler);
api.register('operationsLoadingStatus', operationsLoadStatusHandler);

// register mock handlers
//api.mockResponseForOperation('test');


// initalize the backend
api.init();


// logging
app.use(morgan('combined'));

// use as express middleware to pick-up requests and send to the openapi-backend handler.
app.use((req, res) => api.handleRequest(req as Request, req, res));

var privateKey  = fs.readFileSync('/Users/jason/tmp/sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('/Users/jason/tmp/sslcert/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// start server
httpServer.listen(8080, () => console.info('api listening at http://localhost:8080'));
httpsServer.listen(8443, () => console.info('api listening at https://localhost:8443'));

