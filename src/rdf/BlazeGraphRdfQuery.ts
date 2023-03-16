import { IRdfGraphDB } from "../persistence/IRdfGraphDB";
import { BlazeGraphDB, BlazeGraphDBOptions } from "../persistence/blazegraph/BlazeGraphDB";
import { RdfCompliantBackend } from "./RdfCompliantBackend";

class BlazeGraphRdfQuery extends RdfCompliantBackend {
    constructor() {
        super(new BlazeGraphDB(new BlazeGraphDBOptions({})));
    }
}

export { BlazeGraphRdfQuery }