import * as fs from 'fs';
import { Response, Request} from "express"
import { UploadedFile } from "express-fileupload";
import { Context } from "openapi-backend"
import { BlazeGraph, BlazeGraphOptions } from '../persistence/blazegraph/blazegraph';
import { IRdfGraphDB } from '../interfaces/IRdfGraphDB';
import { persistEmployeeDtoFileData } from '../persistence/persistEmployeeDtoFileData';


const graphDB: IRdfGraphDB = new BlazeGraph(new BlazeGraphOptions({}));

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

            console.log(uploadedFiles.name);
            persistEmployeeDtoFileData(graphDB, filePath);
        }
        response.json({ message: "done" });
    }
}


export { uploadHandler }
