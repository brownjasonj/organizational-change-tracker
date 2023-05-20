import fs from 'fs';
import ParserN3 from '@rdfjs/parser-n3';
import factory from 'rdf-ext';
import DatasetExt from 'rdf-ext/lib/Dataset';
import { Quad } from 'n3';
import SHACLValidator from 'rdf-validate-shacl';
import { BackEndConfiguration } from '../models/eom/configuration/BackEndConfiguration';
import { Logger } from 'pino';
import { RdfInputSourceToN3Parser } from './RdfInputSourceToN3Parser';

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
    private rdfParser: RdfInputSourceToN3Parser;

    constructor(backEndConfiguration: BackEndConfiguration, schemaLocation: string | undefined, logger: Logger, rdfParser: RdfInputSourceToN3Parser) {
        this.logger = logger;
        this.backEndConfiguration = backEndConfiguration;
        this.schemaLocation = schemaLocation;
        this.rdfParser = rdfParser;

        if (this.schemaLocation) {
            this.n3Parser = new ParserN3({ factory });
            switch (this.getSchemaLocationType(this.schemaLocation)) {
                case SchemaLocationType.File:
                    logger.info(`Loading schema from file: ${this.schemaLocation}`);
                    this.schemaDataset = this.rdfParser.fromFileSynchronous(this.schemaLocation);
                    if (this.schemaDataset) {
                        logger.info(`Creating SHACLValidator using ${this.schemaLocation}`)
                        this.validator = new SHACLValidator(this.schemaDataset, { factory });
                    }
                    break;
                case SchemaLocationType.Url:
                    logger.info(`Loading schema from url: ${this.schemaLocation}`);
                    this.rdfParser.fromUrl(this.schemaLocation)
                    .then((dataN3: DatasetExt | undefined) => {
                        if (dataN3) {
                            this.schemaDataset = dataN3;
                            logger.info(`Creating SHACLValidator using ${this.schemaLocation}`)
                            this.validator = new SHACLValidator(this.schemaDataset, { factory });            
                        }
                    });
                    break;
                case SchemaLocationType.String:
                    this.schemaDataset = this.rdfParser.fromStringSynchronous(this.schemaLocation);
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
            this.rdfParser.fromString(data)
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
}

export { RdfSchemaValidation }