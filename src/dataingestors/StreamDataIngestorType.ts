import DatasetExt from "rdf-ext/lib/Dataset";
import { DataIngestionStreamStatus } from "./DataIngestionStreamsFactory";
import { Logger } from "pino";

type StreamDataIngestorType = (filePath: string, organizationSchema: DatasetExt, dataIngestionStatus: DataIngestionStreamStatus, throttleTimeoutMs: number, logger: Logger, failedDataIngestionLogger: Logger) => void;

export { StreamDataIngestorType }