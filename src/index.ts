import cors from 'cors';
import Express from 'express';
import morgan from 'morgan';
import neo4j from 'neo4j-driver';
import { Driver } from 'neo4j-driver-core';
import OpenAPIBackend, { Request } from 'openapi-backend';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {addEmployeeRecordHandler, addEmployeesHandler} from './handlers/addEmployeeRecordHandler';
import notFoundHandler from './handlers/notFoundHandler';
import notImplementedHandler from './handlers/notImplementedHandler';
import testHandler from './handlers/testHandler';
import validationFailHandler from './handlers/validationFailHandler';

const app = Express();
app.use(Express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));

const openApiDocumentPath = './schemas/organizational-changes-openapi.yaml';

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
