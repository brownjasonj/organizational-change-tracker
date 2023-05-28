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
import { departmentCodesAsOfDateHandler } from './handlers/departmentCodesAsOfDateHandler';
import { corporateTitleHistoryByEmployeeIdHandler } from './handlers/corporateTitleHistoryByEmployeeIdHandler';
import fileUpload from 'express-fileupload';
import { operationsFileUploadStatusByRequestIdHandler } from './handlers/operationsFileUploadStatusByRequestIdHandler';
import { uploadEmployeesByFileHandler } from './handlers/uploadEmployeesByFileHandler';
import { employeesJoiningByDepartmentCodeFromDateToDateHandler } from './handlers/employeesJoiningByDepartmentCodeFromDateToDateHandler';
import { employeesLeavingByDepartmentCodeFromDateToDateHandler } from './handlers/employeesLeavingByDepartmentCodeFromDateToDateHandler';
import { operationsDeleteTriplesHandler } from './handlers/operationsDeleteHandler';
import { validationFailHandler } from './handlers/validationFailHandler';
import { notFoundHandler } from './handlers/notFoundHandler';
import { notImplementedHandler } from './handlers/notImplementedHandler';
import { operationsGetConfiguration } from './handlers/operationsGetConfiguration';
import { departmentHistoryByEmployeeIdHandler } from './handlers/departmentHistoryByEmployeeIdHandler';
import { employeeByEmployeeIdHandler } from './handlers/idhandlers/employeeByEmployeeIdHandler';
import { membershipByMembershipIdHandler } from './handlers/idhandlers/membershipByMembershipIdHandler';
import { organizationByOrganizationIdHandler } from './handlers/idhandlers/organizationByOrganizationIdHandler';
import { timeByTimeIdHandler } from './handlers/idhandlers/timeByTimeIdHandler';
import { timeIntervalByTimeIntervalIdHandler } from './handlers/idhandlers/timeIntervalByTimeIntervalIdHandler';
import { employeeByEmployeeSystemIdHandler } from './handlers/idhandlers/employeeByEmployeeSystemIdHandler';
import { operationsFilesUploadStatusesHandler } from './handlers/operationsFilesUploadStatusesHandler';
import { employeeCountByDepartmentCodeAsOfDateHandler } from './handlers/employeeCountByDepartmentCodeAsOfDateHandler';
import { employeeCountByDepartmentCodeFromDateToDateHandler } from './handlers/employeeCountByDepartmentCodeFromDateToDateHandler';
import { employeesJoiningLeavingByDepartmentCodeFromDateToDateHandler } from './handlers/employeesJoiningLeavingByDepartmentCodeFromDateToDateHandler';
import { employeesByDepartmentCodeAsOfDateHandler } from './handlers/employeesByDepartmentCodeAsOfDateHandler';

const expressServer = Express();
// enable file uploads
expressServer.use(fileUpload({
    createParentPath: true
}));

// extende the size of body requests
expressServer.use(Express.json({ limit: '200mb' }));

// enable cors
expressServer.use(cors({
    origin: 'http://localhost:3000',
}));

const openApiDocumentPath = './openapi-schemas/organizational-change-openapi.yaml';

// create api with your definition file or object
const api = new OpenAPIBackend({ 
    definition: openApiDocumentPath
});

// register the swagger-ui
const swaggerDocument = YAML.load(openApiDocumentPath);
expressServer.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// register default handlers
api.register('validationFail', validationFailHandler);
api.register('notFound', notFoundHandler);
api.register('notImplemented', notImplementedHandler);

// register openapi expressServerlication handlers
api.register('employeeByEmployeeId', employeeByEmployeeIdHandler);
api.register('corporateTitleHistoryByEmployeeId', corporateTitleHistoryByEmployeeIdHandler);
api.register('departmentHistoryByEmployeeId', departmentHistoryByEmployeeIdHandler);

api.register('employeesByDepartmentCodeAsOfDate', employeesByDepartmentCodeAsOfDateHandler);
api.register('employeeCountByDepartmentCodeAsOfDate', employeeCountByDepartmentCodeAsOfDateHandler);
api.register('employeeCountByDepartmentCodeFromDateToDate', employeeCountByDepartmentCodeFromDateToDateHandler);
api.register('employeesJoiningLeavingByDepartmentCodeFromDateToDate', employeesJoiningLeavingByDepartmentCodeFromDateToDateHandler);
api.register('employeesJoiningByDepartmentCodeFromDateToDate', employeesJoiningByDepartmentCodeFromDateToDateHandler);
api.register('employeesLeavingByDepartmentCodeFromDateToDate', employeesLeavingByDepartmentCodeFromDateToDateHandler);
api.register('departmentCodesAsOfDate', departmentCodesAsOfDateHandler);
// operations endpoints
api.register('uploadEmployeesByFile', uploadEmployeesByFileHandler);
api.register('operationsFileUploadStatusByRequestId', operationsFileUploadStatusByRequestIdHandler);
api.register('operationsFilesUploadStatuses', operationsFilesUploadStatusesHandler)
api.register('operationsDeleteTriples', operationsDeleteTriplesHandler);
api.register('operationsGetConfiguration', operationsGetConfiguration);
// id endpoints
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
expressServer.use(morgan('combined'));
// expressServer.use(PinoHttp);

// use as express middleware to pick-up requests and send to the openapi-backend handler.
expressServer.use((req, res) => api.handleRequest(req as Request, req, res));


export { expressServer }
