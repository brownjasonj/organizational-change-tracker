class DepartmentHierarchy  {
    id: string;
    uri: string;
    children: Map<string,DepartmentHierarchy>;

    constructor(id: string) {
        this.id = id;
        this.uri = "";
        this.children = new Map<string,DepartmentHierarchy>();
    }

    addChild(child: DepartmentHierarchy) {
        this.children.set(child.id, child);
    }

    getChild(id: string): DepartmentHierarchy | undefined {
        return this.children.get(id);
    }

    setUri(uri: string) {
        this.uri = uri;
    }
}

export { DepartmentHierarchy }