import DatasetExt from "rdf-ext/lib/Dataset";
import { DataIngestionStreamStatus } from "./DataIngestionStreamStatus";
import { Logger } from "pino";
import { RdfSchemaValidation } from "../rdf/RdfSchemaValidation";
import { DataIngestionConfiguration } from "../models/eom/configuration/DataIngestionConfiguration";

type StreamDataIngestorType = (filePath: string, 
                            rdfSchemaValidator: RdfSchemaValidation | undefined, 
                            dataIngestionStatus: DataIngestionStreamStatus,
                            dataIngestionConfiguration: DataIngestionConfiguration,
                            throttleTimeoutMs: number,
                            logger: Logger,
                            failedDataIngestionLogger: Logger) => void;

export { StreamDataIngestorType }