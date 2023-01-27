import fs from 'fs';
import ParserN3 from '@rdfjs/parser-n3';
import factory from 'rdf-ext';
import stringToStream from "string-to-stream"


const loadN3DataSetfromFile = async (filePath: fs.PathLike) => {
    const stream = fs.createReadStream(filePath)
    const parser = new ParserN3({ factory })
    return factory.dataset().import(parser.import(stream))
  }

const loadN3DataSetfromString = async (data: string) => {
    const stream = stringToStream(data);
    const parser = new ParserN3({ factory })
    return factory.dataset().import(parser.import(stream))
  };

export { loadN3DataSetfromFile, loadN3DataSetfromString }