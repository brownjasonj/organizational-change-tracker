import * as fs from 'fs';
import * as es from 'event-stream';
import JSONStream from 'jsonstream';

const processFileStreamAsJson = async (filePath: string, processObject: (data: any) => void): Promise<string> => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    return new Promise((resolve, reject) => {
        stream.pipe(parser).pipe(es.mapSync((data: any) => {
            processObject(data);
        })).on('end', () => {
            resolve('end');
        });
    });
};

export { processFileStreamAsJson }