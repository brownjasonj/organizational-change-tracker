import fs from "fs";
import csv from "csv-parser";
import JSONStream from 'jsonstream';
import { pipeline } from 'stream';
import { consoleLogger } from "../logging/consoleLogger";
import { Logger } from "pino";
import { DataIngestionConfiguration } from "../models/eom/configuration/DataIngestionConfiguration";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfSchemaValidation } from "../rdf/RdfSchemaValidation";
import { DataIngestionStreamStatus } from "./DataIngestionStreamStatus";
import { StreamThrottle } from "./streamstages/StreamThrottle";
import { StreamTransformEmployeeDtoToEmployee } from "./streamstages/StreamTransformEmployeeDtoToEmployee";
import { StreamTransformEmployeeToRdf } from "./streamstages/StreamTransformEmployeeToRdf";
import { StreamRdfBankOrgValidation } from "./streamstages/StreamRdfBankOrgValidation";
import { StreamRdfTurtlePersistToGraphStore } from "./streamstages/StreamRdfTurtlePersistToGraphStore";
import { StreamDataIngestionStatusUpdater } from "./streamstages/StreamDataIngestionStatusUpdater";
import { StreamDataIngestionCleanup } from "./streamstages/StreamDataIngestionCleanup";
import { createDataIngestionLogger } from "../logging/createDataIngestionLogger";
import { createFailedDataIngestionLogger } from "../logging/createFailedDataIngestionLogger";
import { HttpClient } from "../utils/HttpClient";
import { RdfInputSourceToN3Parser } from "../rdf/RdfInputSourceToN3Parser";
import { UploadedFile } from "express-fileupload";
import { LoggingConfiguration } from "../models/eom/configuration/LoggingConfiguration";
import { DataIngestionStreamStatuses } from "./DataIngestionStreamStatuses";


class DataIngestionPipeline {
    private dataIngestionConfiguration: DataIngestionConfiguration;
    private loggingConfiguration: LoggingConfiguration;
    private organizationRdfQuery: IOrganizationRdfQuery;
    private dataIngestionStatuses: DataIngestionStreamStatuses;
    private httpClient: HttpClient;

    constructor(organizationRdfQuery: IOrganizationRdfQuery,
            dataIngestionConfiguration: DataIngestionConfiguration,
            dataIngestionStatuses: DataIngestionStreamStatuses,
            loggingConfiguration: LoggingConfiguration,
            httpClient: HttpClient) { 
        this.dataIngestionConfiguration = dataIngestionConfiguration;
        this.loggingConfiguration = loggingConfiguration;
        this.organizationRdfQuery = organizationRdfQuery;
        this.dataIngestionStatuses = dataIngestionStatuses;
        this.httpClient = httpClient;
    }

    public getDataIngestionStatuses(): DataIngestionStreamStatuses {
        return this.dataIngestionStatuses;
    }

    public csvEmployeeDTOFileToEmployeeStream(filePath: string, 
        rdfSchemaValidator: RdfSchemaValidation | undefined,
        dataIngestionStatus: DataIngestionStreamStatus,
        logger: Logger,
        failedDataIngestionLogger: Logger):void  
        {
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        const streamThrottle = new StreamThrottle(this.dataIngestionConfiguration.getStreamTrottleTimeoutMs(), logger);
        const csvParser = csv();
    
        consoleLogger.info("csvEmployeeDTOFileToEmployeeStream");
        
        pipeline(
            stream,
            csvParser,
            streamThrottle,
            new StreamTransformEmployeeDtoToEmployee(logger),
            new StreamTransformEmployeeToRdf(logger),
            new StreamRdfBankOrgValidation(rdfSchemaValidator, logger),
            new StreamRdfTurtlePersistToGraphStore(streamThrottle, this.organizationRdfQuery, logger, failedDataIngestionLogger),
            new StreamDataIngestionStatusUpdater(dataIngestionStatus, logger),
            new StreamDataIngestionCleanup(this.dataIngestionConfiguration, dataIngestionStatus, logger),
            (err: any) => consoleLogger.error('end', err)
        );
    }

    public jsonEmployeeDTOFileToEmployeeStream(filePath: string, 
        rdfSchemaValidator: RdfSchemaValidation | undefined,
        dataIngestionStatus: DataIngestionStreamStatus,
        logger: Logger,
        failedDataIngestionLogger: Logger): void  {
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        const parser = JSONStream.parse('*');
        const streamThrottle = new StreamThrottle(this.dataIngestionConfiguration.getStreamTrottleTimeoutMs(), logger);

        pipeline(
            stream,
            parser,
            streamThrottle,
            new StreamTransformEmployeeDtoToEmployee(logger),
            new StreamTransformEmployeeToRdf(logger),
            new StreamRdfBankOrgValidation(rdfSchemaValidator, logger),
            new StreamRdfTurtlePersistToGraphStore(streamThrottle, this.organizationRdfQuery, logger, failedDataIngestionLogger),
            new StreamDataIngestionStatusUpdater(dataIngestionStatus, logger),
            new StreamDataIngestionCleanup(this.dataIngestionConfiguration, dataIngestionStatus, logger),
            //         (err) => {
            //             if (err) {
            //               console.error('Pipeline failed', err);
            //             } else {
            //               console.log('Pipeline succeeded');
            //             }
            //         }
            err => consoleLogger.error('end', err)
            );
        }
    
    public getFileExtension(filePath: string) : string {
        return filePath.substring(filePath.lastIndexOf(".") + 1);
    }

    public processFile(file: UploadedFile): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const dataIngestionStreamStatus = this.dataIngestionStatuses.createStreamStatus();

            // create the file name of the data that will be stored temporarily.  the name is a combination of the file passed into 
            // request and the the request id.  this is done to ensure that the file name is unique and that the file is not overwritten
            const temporaryFileName = `${dataIngestionStreamStatus.getRequestId()}-${file.name}`;
            const temporaryFilePath: string = `${this.dataIngestionConfiguration.getTemporaryDirectory()}/${temporaryFileName}`;

            file.mv(temporaryFilePath).then(() => {
                const dataIngestionLogger = createDataIngestionLogger(this.loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}.json`);
                const failedDataIngestionLogger = createFailedDataIngestionLogger(this.loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}-failed.json`);
                const rdfInputSourceToN3Parser = new RdfInputSourceToN3Parser(this.httpClient, dataIngestionLogger);
                var rdfValidateData = undefined;
                
                if (this.dataIngestionConfiguration.getOntologyValidation()) {
                    rdfValidateData = new RdfSchemaValidation(this.dataIngestionConfiguration.getOntologyValidationSchemaPath(), dataIngestionLogger, rdfInputSourceToN3Parser);
                }

                dataIngestionLogger.info(file.name);
                dataIngestionLogger.info(temporaryFilePath);
                
                switch(this.getFileExtension(temporaryFilePath)) {
                    case 'csv':
                        this.csvEmployeeDTOFileToEmployeeStream(temporaryFilePath, rdfValidateData, dataIngestionStreamStatus, dataIngestionLogger, failedDataIngestionLogger);
                        break;
                    case 'json':
                        this.jsonEmployeeDTOFileToEmployeeStream(temporaryFilePath, rdfValidateData, dataIngestionStreamStatus, dataIngestionLogger, failedDataIngestionLogger);
                        break;
                    case 'xlsx':
                    case 'xslb':
                    default:
                        throw new Error(`Unsupported file type: ${this.getFileExtension(file.name)}`);
                }
                resolve(dataIngestionStreamStatus.getRequestId());
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

export { DataIngestionPipeline }