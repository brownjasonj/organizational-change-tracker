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
import { IOrganizationRdfQuery } from "./rdf/IOrganizationRdfQuery";
import { DataIngestionPipeline } from './dataingestors/DataIngestionPipeline';


class FrontEndServer {
    private _rdfOrganization: IOrganizationRdfQuery;
    private _dataIngestionPipeline: DataIngestionPipeline;
    private expressServer: Express.Express;

    constructor(rdfOrganization: IOrganizationRdfQuery, dataIngestionPipeline: DataIngestionPipeline) {
        this._rdfOrganization = rdfOrganization;
        this._dataIngestionPipeline = dataIngestionPipeline;
        this.expressServer = Express();
        // enable file uploads
        this.expressServer.use(fileUpload({
            createParentPath: true
        }));

        // extende the size of body requests
        this.expressServer.use(Express.json({ limit: '200mb' }));

        // enable cors
        this.expressServer.use(cors({
            origin: 'http://localhost:3000',
        }));

        const openApiDocumentPath = './openapi-schemas/organizational-change-openapi.yaml';

        // create api with your definition file or object
        const api = new OpenAPIBackend({ 
            definition: openApiDocumentPath
        });

        // register the swagger-ui
        const swaggerDocument = YAML.load(openApiDocumentPath);
        this.expressServer.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // register default handlers
        api.register('validationFail', validationFailHandler);
        api.register('notFound', notFoundHandler);
        api.register('notImplemented', notImplementedHandler);

        // register openapi this.expressServerlication handlers
        api.register('employeeByEmployeeId', employeeByEmployeeIdHandler(rdfOrganization));
        api.register('corporateTitleHistoryByEmployeeId', corporateTitleHistoryByEmployeeIdHandler(rdfOrganization));
        api.register('departmentHistoryByEmployeeId', departmentHistoryByEmployeeIdHandler(rdfOrganization));

        api.register('employeesByDepartmentCodeAsOfDate', employeesByDepartmentCodeAsOfDateHandler(rdfOrganization));
        api.register('employeeCountByDepartmentCodeAsOfDate', employeeCountByDepartmentCodeAsOfDateHandler(rdfOrganization));
        api.register('employeeCountByDepartmentCodeFromDateToDate', employeeCountByDepartmentCodeFromDateToDateHandler(rdfOrganization));
        api.register('employeesJoiningLeavingByDepartmentCodeFromDateToDate', employeesJoiningLeavingByDepartmentCodeFromDateToDateHandler(rdfOrganization));
        api.register('employeesJoiningByDepartmentCodeFromDateToDate', employeesJoiningByDepartmentCodeFromDateToDateHandler(rdfOrganization));
        api.register('employeesLeavingByDepartmentCodeFromDateToDate', employeesLeavingByDepartmentCodeFromDateToDateHandler(rdfOrganization));
        api.register('departmentCodesAsOfDate', departmentCodesAsOfDateHandler(rdfOrganization));
        // operations endpoints
        api.register('uploadEmployeesByFile', uploadEmployeesByFileHandler(this._dataIngestionPipeline));
        api.register('operationsFileUploadStatusByRequestId', operationsFileUploadStatusByRequestIdHandler(this._dataIngestionPipeline.getDataIngestionStatuses()));
        api.register('operationsFilesUploadStatuses', operationsFilesUploadStatusesHandler(this._dataIngestionPipeline.getDataIngestionStatuses()))
        api.register('operationsDeleteTriples', operationsDeleteTriplesHandler(rdfOrganization));
        api.register('operationsGetConfiguration', operationsGetConfiguration);
        // id endpoints
        api.register('employeeByEmployeeSystemId', employeeByEmployeeSystemIdHandler(rdfOrganization))
        api.register('membershipByMembershipId', membershipByMembershipIdHandler(rdfOrganization));
        api.register('organizationByOrganizationId', organizationByOrganizationIdHandler(rdfOrganization));
        api.register('timeByTimeId', timeByTimeIdHandler(rdfOrganization));
        api.register('timeIntervalByTimeIntervalId', timeIntervalByTimeIntervalIdHandler(rdfOrganization));

        // register mock handlers
        //api.mockResponseForOperation('test');


        // initalize the backend
        api.init();


        // logging
        this.expressServer.use(morgan('combined'));
        // this.expressServer.use(PinoHttp);

        // use as express middleware to pick-up requests and send to the openapi-backend handler.
        this.expressServer.use((req, res) => api.handleRequest(req as Request, req, res));
    }

    public getExpressServer(): Express.Express {
        return this.expressServer;
    }
}

export { FrontEndServer }