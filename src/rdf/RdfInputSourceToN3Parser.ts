import fs from 'fs';
import ParserN3 from '@rdfjs/parser-n3';
import factory from 'rdf-ext';
import stringToStream from "string-to-stream"
import DatasetExt from 'rdf-ext/lib/Dataset';
import { Quad } from 'n3';
import { HttpClient } from '../utils/HttpClient';
import { Logger } from 'pino';

class RdfInputSourceToN3Parser {
    private logger: Logger;
    private httpClient: HttpClient;
    private n3Parser: ParserN3<Quad> | undefined = undefined;

    constructor(httpClient: HttpClient, logger: Logger) {
        this.logger = logger;
        this.httpClient = httpClient;
        this.n3Parser = new ParserN3({ factory });
    }

    public async fromFile(filePath: fs.PathLike): Promise<DatasetExt> {
        const stream = fs.createReadStream(filePath)
        const parser = new ParserN3({ factory })
        return factory.dataset().import(parser.import(stream))
      }
    
    public fromFileSynchronous = (filePath: fs.PathLike): DatasetExt => {
        const stream = fs.createReadStream(filePath)
        const parser = new ParserN3({ factory })
        factory.dataset().import(parser.import(stream)).then((dataset: DatasetExt) => {
            return dataset;
        }).catch((error: any) => {
            this.logger.error(error);
        });
        return factory.dataset();
    }
    
    public async fromString(data: string): Promise<DatasetExt> {
        const stream = stringToStream(data);
        const parser = new ParserN3({ factory })
        return factory.dataset().import(parser.import(stream))
      };

    public fromStringSynchronous = (data: string): DatasetExt | undefined => {
        this.fromString(data).then((dataset: DatasetExt) => {
            return dataset;
        }).catch((error: any) => {
            this.logger.error(error);
            return undefined;
        });
        return undefined;
    }
          
    public async fromUrl(url: string): Promise<DatasetExt | undefined> {
        // require the url to point to an end-point that returns a turtle document
        // representing the schema.  If the body returned is not a turtle document
        // then we cannot validate the data, so return undefined
        return new Promise<DatasetExt | undefined>((resolve, reject) => {
            this.httpClient.get(url, { Accept: 'text/turtle' }, false).then((response: any) => {
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
    
    public fromUrlSynchronous(url: string): DatasetExt | undefined {
        this.fromUrl(url).then((dataset: DatasetExt | undefined) => {
            return dataset;
        }).catch((error: any) => {
            this.logger.error(error);
            return undefined;
        });
        return undefined;
    };
}

export { RdfInputSourceToN3Parser }