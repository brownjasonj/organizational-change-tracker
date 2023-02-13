import { Writable } from "stream";
import { IRdfGraphDB } from "../interfaces/IRdfGraphDB";
import { GraphPersistenceFactory } from "./GraphPersistenceFactory";


class StreamRdfTurtlePersistToGraphStore extends Writable {
    private graphDB: IRdfGraphDB;
    constructor() {
        super({ objectMode: true });
        this.graphDB = GraphPersistenceFactory.getGraphDB();
    }

    _write(data: string, encoding: string, next: Function) {
        this.graphDB.turtleUpdate(data)
                .then((res) => {
                    console.log(res);
                })
            .catch((err) => {
                console.log(`Error: ${err.message}.  Pushing to retry list.`);
            })
        next();
    }
}

export { StreamRdfTurtlePersistToGraphStore }