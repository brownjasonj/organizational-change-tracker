import cors from 'cors';
import Express from 'express';
import morgan from 'morgan';
import { OpenAPIBackend, Request } from 'openapi-backend';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {addEmployeeRecordHandler, addEmployeesHandler} from './handlers/addEmployeeRecordHandler';
import notFoundHandler from './handlers/notFoundHandler';
import notImplementedHandler from './handlers/notImplementedHandler';
import testHandler from './handlers/testHandler';
import validationFailHandler from './handlers/validationFailHandler';
import { employeeCountByDepartmentCodeHandler } from './handlers/employeeCountByDepartmentCodeHandler';
import { departmentCodesHandler } from './handlers/departmentCodesHandler';
import { departmentHistoryHandler } from './handlers/departmentHistoryHandler';
import { uploadHandler } from './handlers/uploadHandler';
import { employeeRoleHistoryHandler } from './handlers/employeeRoleHistoryHandler';
import { employeeDepartmentHistoryHandler } from './handlers/employeeDepartmentHistoryHandler';
import fileUpload from 'express-fileupload';

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
api.register('addemployeePost', addEmployeesHandler);
api.register('employeeDepartmentHistory', employeeDepartmentHistoryHandler);
api.register('employeeRoleHistory', employeeRoleHistoryHandler);
api.register('employee-count-by-department-code', employeeCountByDepartmentCodeHandler);
api.register('department-codes', departmentCodesHandler);
api.register('departmentHistory', departmentHistoryHandler);
api.register('upload', uploadHandler);

// register mock handlers
//api.mockResponseForOperation('test');


// initalize the backend
api.init();


// logging
app.use(morgan('combined'));

// use as express middleware to pick-up requests and send to the openapi-backend handler.
app.use((req, res) => api.handleRequest(req as Request, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));

