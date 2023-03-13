import DatasetExt from "rdf-ext/lib/Dataset";
import { DataIngestionStreamStatus } from "./DataIngestionStreamsFactory";

type StreamDataIngestorType = (filePath: string, organizationSchema: DatasetExt, dataIngestionStatus: DataIngestionStreamStatus) => void;

export { StreamDataIngestorType }