import fs from 'fs';
import ParserN3 from '@rdfjs/parser-n3';
import factory from 'rdf-ext';
import stringToStream from "string-to-stream"
import DatasetExt from 'rdf-ext/lib/Dataset';
import { Quad } from 'n3';
import SHACLValidator from 'rdf-validate-shacl';
import { HttpClient } from '../utils/HttpClient';
import { BackEndConfiguration } from '../models/eom/configuration/BackEndConfiguration';
import { Logger } from 'pino';

enum SchemaLocationType {
    File,
    Url,
    String
}

class RdfSchemaValidation {
    private logger: Logger;
    private backEndConfiguration: BackEndConfiguration;
    private schemaLocation: string | undefined = undefined;
    private n3Parser: ParserN3<Quad> | undefined = undefined;
    private validator: SHACLValidator | undefined = undefined;
    private schemaDataset: DatasetExt | undefined = undefined;

    constructor(backEndConfiguration: BackEndConfiguration, schemaLocation: string | undefined, logger: Logger) {
        this.logger = logger;
        this.backEndConfiguration = backEndConfiguration;
        this.schemaLocation = schemaLocation;
        if (this.schemaLocation) {
            this.n3Parser = new ParserN3({ factory });
            switch (this.getSchemaLocationType(this.schemaLocation)) {
                case SchemaLocationType.File:
                    logger.info(`Loading schema from file: ${this.schemaLocation}`);
                    this.schemaDataset = this.syncLoadN3DataSetfromFile(this.schemaLocation);
                    if (this.schemaDataset) {
                        logger.info(`Creating SHACLValidator using ${this.schemaLocation}`)
                        this.validator = new SHACLValidator(this.schemaDataset, { factory });
                    }
                    break;
                case SchemaLocationType.Url:
                    logger.info(`Loading schema from url: ${this.schemaLocation}`);
                    this.loadN3DataSetfromUrl(this.schemaLocation)
                    .then((dataN3: DatasetExt | undefined) => {
                        if (dataN3) {
                            this.schemaDataset = dataN3;
                            logger.info(`Creating SHACLValidator using ${this.schemaLocation}`)
                            this.validator = new SHACLValidator(this.schemaDataset, { factory });            
                        }
                    });
                    break;
                case SchemaLocationType.String:
                    this.schemaDataset = this.syncloadN3DataSetfromString(this.schemaLocation);
                    if (this.schemaDataset) {
                        logger.info(`Creating SHACLValidator using ${this.schemaLocation}`)
                        this.validator = new SHACLValidator(this.schemaDataset!, { factory });
                    }
                    break;
            }
        }
    }

    public validationEnabled(): boolean {
        return this.validator !== undefined;
    }

    public validate(data: string): boolean {
        if (this.validator) {
            this.loadN3DataSetfromString(data)
            .then((dataN3: DatasetExt) => {
                // we know that this.validator is not undefined
                const report = this.validator!.validate(dataN3);
                if (report.conforms) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch((error: any) => {
                return false;
            });
        }
        else {
            return true;
        }
        return true;
    }

    private getSchemaLocationType(schemaLocation: string): SchemaLocationType {
        if (fs.existsSync(schemaLocation)) {
            return SchemaLocationType.File;
        }
        else if (schemaLocation.startsWith("http://") || schemaLocation.startsWith("https://")) {
            return SchemaLocationType.Url;
        }
        else {
            return SchemaLocationType.String;
        }
    }

    private loadN3DataSetfromFile = async (filePath: fs.PathLike) => {
        const stream = fs.createReadStream(filePath)
        const parser = new ParserN3({ factory })
        return factory.dataset().import(parser.import(stream))
      }
    
    private syncLoadN3DataSetfromFile = (filePath: fs.PathLike): DatasetExt => {
        const stream = fs.createReadStream(filePath)
        const parser = new ParserN3({ factory })
        factory.dataset().import(parser.import(stream)).then((dataset: DatasetExt) => {
            return dataset;
        }).catch((error: any) => {
            this.logger.error(error);
        });
        return factory.dataset();
    }
    
    private loadN3DataSetfromString = async (data: string) => {
        const stream = stringToStream(data);
        const parser = new ParserN3({ factory })
        return factory.dataset().import(parser.import(stream))
      };

    private syncloadN3DataSetfromString = (data: string): DatasetExt | undefined => {
        this.loadN3DataSetfromString(data).then((dataset: DatasetExt) => {
            return dataset;
        }).catch((error: any) => {
            this.logger.error(error);
            return undefined;
        });
        return undefined;
    }
    
    private syncloadN3DataSetfromUrl(url: string): DatasetExt | undefined {
        // require the url to point to an end-point that returns a turtle document
        // representing the schema.  If the body returned is not a turtle document
        // then we cannot validate the data, so return undefined
        const httpClient: HttpClient = new HttpClient(this.backEndConfiguration);
        httpClient.get(url, { Accept: 'text/turtle' }, false).then((response: any) => {
            if (response.status === 200) {
                this.logger.error(`Data returned: ${response.data}`);
                const stream = stringToStream(response.data);
                return factory.dataset().import(this.n3Parser!.import(stream))
                .then((dataN3: DatasetExt) => {
                    return dataN3;
                })
                .catch((error: any) => {
                    this.logger.error(error);
                    return undefined;
                });
            }
            else {
                this.logger.error(`Error returned: ${response.status}`);
                return undefined;
            }})
        .catch((error: any) => {
            this.logger.error(error);
            return undefined;
        });
        return undefined;
      };

      private async loadN3DataSetfromUrl(url: string): Promise<DatasetExt | undefined> {
        // require the url to point to an end-point that returns a turtle document
        // representing the schema.  If the body returned is not a turtle document
        // then we cannot validate the data, so return undefined
        return new Promise<DatasetExt | undefined>((resolve, reject) => {
            const httpClient: HttpClient = new HttpClient(this.backEndConfiguration);
            httpClient.get(url, { Accept: 'text/turtle' }, false).then((response: any) => {
                if (response.status === 200) {
                    this.logger.error(`Data returned: ${response.data}`);
                    const stream = stringToStream(response.data);
                    return factory.dataset().import(this.n3Parser!.import(stream))
                    .then((dataN3: DatasetExt) => {
                        resolve(dataN3);
                    })
                    .catch((error: any) => {
                        this.logger.error(error);
                        reject(undefined);
                    });
                }
                else {
                    this.logger.error(`Error returned: ${response.status}`);
                    resolve(undefined);
                }})
            .catch((error: any) => {
                reject(error);
            });
        });
        };
}

export { RdfSchemaValidation }