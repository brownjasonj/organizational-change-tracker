import DatasetExt from "rdf-ext/lib/Dataset";
import { DataIngestionStreamStatus } from "./DataIngestionStreamsFactory";
import { Logger } from "pino";
import { RdfSchemaValidation } from "../rdf/RdfSchemaValidation";

type StreamDataIngestorType = (filePath: string, 
                            rdfSchemaValidator: RdfSchemaValidation | undefined, 
                            dataIngestionStatus: DataIngestionStreamStatus,
                            throttleTimeoutMs: number,
                            logger: Logger,
                            failedDataIngestionLogger: Logger) => void;

export { StreamDataIngestorType }