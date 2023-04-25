

class LoggingConfiguration {
    static singleton: LoggingConfiguration;
    dataIngestionLogging: boolean;
    dataIngestionLoggingLevel: string;
    dataIngestionLoggingPath: string;
    constructor() {
        this.dataIngestionLogging = false;
        this.dataIngestionLoggingLevel = 'info';
        this.dataIngestionLoggingPath = './logs/dataIngestion/';
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
}

export { LoggingConfiguration }