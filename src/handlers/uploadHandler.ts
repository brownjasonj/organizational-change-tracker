import * as fs from 'fs';
import { Response, Request} from "express"
import { FileArray, UploadedFile } from "express-fileupload";
import { Context } from "openapi-backend"
import { EmployeeDto } from '../models/dto/EmployeeDto';
import { employeeDtoToEmployee } from '../models/mappers/EmployeeMapper';
import { Employee } from '../models/eom/Employee';
import organizationaRdfGenerator from '../rdf-generators/OrganizationRdfGenerator';
import { BlazeGraph, BlazeGraphOptions } from '../blazegraph/blazegraph';
import { xml2json } from 'xml-js';


const blazeGraphOptions: BlazeGraphOptions = new BlazeGraphOptions({});
const blazegraph: BlazeGraph = new BlazeGraph(new BlazeGraphOptions({}));

const uploadHandler = async (context: Context, request: Request, response: Response) => {
    if (!request.files) {
        return response.status(400).send('No files were uploaded.');
    }
    else {
        const uploadedFiles = request.files.file;
        if (uploadedFiles instanceof Array) {
            uploadedFiles.forEach((uploadedFile) => {
                console.log(uploadedFile.name);
            });
        }
        else {
            const file: UploadedFile = uploadedFiles as UploadedFile;
            const filePath: string = `./tmp/${file.name}`;

            await file.mv(filePath, function(err) {
                return response.json(err);
            });

            await fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  return;
                }
                const jsonData = JSON.parse(data);
                jsonData.forEach((employeeDto: EmployeeDto) => {
                    const employeeRecord: Employee = employeeDtoToEmployee(employeeDto);
                    console.log(employeeRecord);
                    organizationaRdfGenerator(employeeRecord, (error, result) => {
                            blazegraph.turtleUpdate(result)
                            .then((res) => {
                                console.log(xml2json(res))
                            })
                        .catch((err) => console.log(err));
                    });
                });
              });

            console.log(uploadedFiles.name);
        }
        response.json({ message: "done" });
    }
}

export { uploadHandler }
