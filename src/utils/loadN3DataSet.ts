import fs from 'fs';
import ParserN3 from '@rdfjs/parser-n3';
import factory from 'rdf-ext';
import stringToStream from "string-to-stream"
import DatasetExt from 'rdf-ext/lib/Dataset';


const loadN3DataSetfromFile = async (filePath: fs.PathLike) => {
    const stream = fs.createReadStream(filePath)
    const parser = new ParserN3({ factory })
    return factory.dataset().import(parser.import(stream))
  }

const syncLoadN3DataSetfromFile = (filePath: fs.PathLike): DatasetExt => {
    const stream = fs.createReadStream(filePath)
    const parser = new ParserN3({ factory })
    factory.dataset().import(parser.import(stream)).then((dataset: DatasetExt) => {
        return dataset;
    }).catch((error: any) => {
        console.log(error);
    });
    return factory.dataset();
}

const loadN3DataSetfromString = async (data: string) => {
    const stream = stringToStream(data);
    const parser = new ParserN3({ factory })
    return factory.dataset().import(parser.import(stream))
  };

export { loadN3DataSetfromFile, loadN3DataSetfromString, syncLoadN3DataSetfromFile}