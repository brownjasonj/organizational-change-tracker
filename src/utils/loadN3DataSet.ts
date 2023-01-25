import fs from 'fs';
import ParserN3 from '@rdfjs/parser-n3';
import factory from 'rdf-ext';

const loadN3DataSet = async (filePath: fs.PathLike) => {
    const stream = fs.createReadStream(filePath)
    const parser = new ParserN3({ factory })
    return factory.dataset().import(parser.import(stream))
  }

export { loadN3DataSet }