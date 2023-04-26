

class LoggingConfiguration {
    static singleton: LoggingConfiguration;
    dataIngestionLogging: boolean;
    dataIngestionLoggingLevel: string;
    dataIngestionLoggingPath: string;
    dataIngestionDeadLetterPath: string;
    queryLogging: boolean;
    queryLoggingLevel: string;
    queryLoggingPath: string;

    constructor() {
        this.dataIngestionLogging = false;
        this.dataIngestionLoggingLevel = 'info';
        this.dataIngestionLoggingPath = './logs/dataIngestion/';
        this.dataIngestionDeadLetterPath = './logs/dataIngestion/deadLetter/';
        this.queryLogging = false;
        this.queryLoggingLevel = 'info';
        this.queryLoggingPath = './logs/queries/';
    }

    static getInstance(): LoggingConfiguration {
        if (LoggingConfiguration.singleton == null) {
            LoggingConfiguration.singleton = new LoggingConfiguration();
        }
        return LoggingConfiguration.singleton;
    }

    getDataIngestionLogging(): boolean {
        return this.dataIngestionLogging;
    }

    getDataIngestionLoggingLevel(): string {
        return this.dataIngestionLoggingLevel;
    }

    getDataIngestionLoggingPath(): string {
        return this.dataIngestionLoggingPath;
    }

    getDataIngestionDeadLetterPath(): string {
        return this.dataIngestionDeadLetterPath;
    }

    getQueryLogging(): boolean {
        return this.queryLogging;
    }

    getQueryLoggingLevel(): string {
        return this.queryLoggingLevel;
    }

    getQueryLoggingPath(): string {
        return this.queryLoggingPath;
    }
}

export { LoggingConfiguration }