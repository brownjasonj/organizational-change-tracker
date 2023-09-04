import { DepartmentHierarchy } from "../eom/DepartmentHierarchy"



const DepartmentHierarchyFromSparqlMapper = (rootDepartmentCode: string, depth: number, sparqlJsonData: any): DepartmentHierarchy => {
    const departmentMap = new Map<string, DepartmentHierarchy>();

    // grab the results binding section of the json data returned from the sparql query
    const sparqlResults = sparqlJsonData.results.bindings;

    // iterate over each result
    sparqlResults.forEach((sparqlResult: any) => {
        // only process results with distance 1, since distances >1 are not relevant for the hierarchy
        // as they represent root to node links that are more complex than a direct parent-child relationship
        if (sparqlResult.distance.value == 1) {
            // each result is a link from a departmener to it's immediate successor
            const parentDepartmentName = sparqlResult.root_name.value;

            // check the parent node already exists
            var parentDepartment = departmentMap.get(parentDepartmentName);
            if (parentDepartment == undefined) {
                // if not, create it
                parentDepartment = new DepartmentHierarchy(parentDepartmentName);
                // set it's uri
                parentDepartment.setUri(sparqlResult.root.value);
                departmentMap.set(parentDepartmentName, parentDepartment);
            }

            // get the child node
            const childDepartmentName = sparqlResult.sub_name.value;
            var childDepartment = departmentMap.get(childDepartmentName);
            if (childDepartment == undefined) {
                // if not, create it
                childDepartment = new DepartmentHierarchy(childDepartmentName);
                // set it's uri
                childDepartment.setUri(sparqlResult.sub.value);
                departmentMap.set(childDepartmentName, childDepartment);
            }

            // add the child to the parent
            parentDepartment.addChild(childDepartment);
        }
    });

    var rootDepartment = departmentMap.get(rootDepartmentCode);
    if (rootDepartment == undefined) {
        console.log(`rootDepartmentCode:${rootDepartmentCode} not found in departmentMap`);
        return new DepartmentHierarchy("Error - rootDepartmentCode not found in departmentMap");
    }

    return rootDepartment;
}

const DepartmentHierarchyFromSparqlMapper2 = (rootDepartmentCode: string, depth: number, sparqlJsonData: any): DepartmentHierarchy => {
    const departmentHierarchy = new DepartmentHierarchy(rootDepartmentCode);

    const sparqlResults = sparqlJsonData.results.bindings;
    /*

    */
    sparqlResults.forEach((sparqlResult: any) => {
        // only process results with distance 1, since distances >1 are not relevant for the hierarchy
        // as they represent root to node links that are more complex than a direct parent-child relationship
        if (sparqlResult.distance.value == 1 && sparqlResult.root_name.value.length > 0) {
            const rootDepartmentName = sparqlResult.root_name.value;
            // the rootDepartmentName is assumed to be a string of letters, the index of each letter represents
            // the level in the tree hierarchy, e.g.: ABCD represents a tree with 4 levels with the parrent to child
            // relationship A->AB->ABC->ABCD.
            // var parentDepartment = departmentHierarchy;
            // if (parentDepartment.id != rootDepartmentName) {
            //     for(var i = 1; i < rootDepartmentName.length; i++) {
            //         const rootSubDepartmentName = rootDepartmentName.substring(0,i+1);
            //         console.log(`rootSubDepartmentName:${rootSubDepartmentName}`);
            //         console.log(`parentDepartment: ${parentDepartment}`);
            //         if (parentDepartment.getChild(rootSubDepartmentName) == undefined) {
            //             const newDepartment = new DepartmentHierarchy(rootSubDepartmentName);
            //             parentDepartment.addChild(newDepartment);
            //             parentDepartment = newDepartment;
            //         }
            //         else {
            //             parentDepartment = parentDepartment.getChild(rootSubDepartmentName)!;
            //         }
            //     }
            // }
            // else {
            //     parentDepartment.setUri(sparqlResult.root.value);
            // }

            var parentDepartment = departmentHierarchy;
            for(var nameLength = 0; nameLength < rootDepartmentName.length; nameLength++) {
                const departmentName = rootDepartmentName.substring(0,nameLength+1);
                if (parentDepartment.id != departmentName) {
                    if (parentDepartment.getChild(departmentName) == undefined) {
                        const newDepartment = new DepartmentHierarchy(departmentName);
                        parentDepartment.addChild(newDepartment);
                        parentDepartment = newDepartment;
                    }
                    else {
                        parentDepartment = parentDepartment.getChild(departmentName)!;
                    }
                }
            }


            const subDepartmentName = sparqlResult.sub_name.value;
            var subDepartment = parentDepartment.getChild(subDepartmentName);
            if (subDepartment == undefined) {
                subDepartment = new DepartmentHierarchy(subDepartmentName);
                parentDepartment.addChild(subDepartment);
            }

            // set the values of the subDepartment to the values of the sparqlResult
            subDepartment.setUri(sparqlResult.sub.value);
        }
    });
    return departmentHierarchy;
}

export { DepartmentHierarchyFromSparqlMapper }