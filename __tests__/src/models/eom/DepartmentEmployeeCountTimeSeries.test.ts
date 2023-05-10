import { DepartmentEmployeeCountTimeEpoc } from "../../../../src/models/eom/DepartmentEmployeeCountTimeEpoc";
import { DepartmentEmployeeCountTimeSeries } from "../../../../src/models/eom/DepartmentEmployeeCountTimeSeries";


describe("DepartmentEmployeeCountTimeSeries test", () => {
    test("Construct instance of DepartmentEmployeeCountTimeSeries and check the values", async () => {
        const departmentName: string = "123456789";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const dateStep: number = 1;
        const departmentEmployeeCount = new DepartmentEmployeeCountTimeSeries(departmentName, startDate, endDate, dateStep);
        expect(departmentEmployeeCount.departmentName).toContain(departmentName);
        expect(departmentEmployeeCount.startDate).toEqual(startDate);
        expect(departmentEmployeeCount.endDate).toEqual(endDate);
        expect(departmentEmployeeCount.dateStep).toEqual(dateStep);
        expect(departmentEmployeeCount.timeseries).toEqual([]);
    });

    test("Construct instance of DepartmentEmployeeCountTimeSeries, add a time epoc point.", async () => {
        const departmentName: string = "123456789";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const dateStep: number = 1;
        const departmentEmployeeCount = new DepartmentEmployeeCountTimeSeries(departmentName, startDate, endDate, dateStep);
        expect(departmentEmployeeCount.getDepartmentName()).toContain(departmentName);
        expect(departmentEmployeeCount.getStartDate()).toEqual(startDate);
        expect(departmentEmployeeCount.getStartDate()).toEqual(endDate);
        expect(departmentEmployeeCount.getDateStep()).toEqual(dateStep);
        expect(departmentEmployeeCount.getTimeseries()).toEqual([]);

        const departmentEmployeeCountTimeEpoc = new DepartmentEmployeeCountTimeEpoc(departmentName, startDate, endDate, 1);
        departmentEmployeeCount.addPoint(departmentEmployeeCountTimeEpoc);
        expect(departmentEmployeeCount.getTimeseries()).toEqual([departmentEmployeeCountTimeEpoc]);
    });

    test("Construct instance of DepartmentEmployeeCountTimeSeries, add the same time epoc point twice.", async () => {
        const departmentName: string = "123456789";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const dateStep: number = 1;
        const departmentEmployeeCount = new DepartmentEmployeeCountTimeSeries(departmentName, startDate, endDate, dateStep);
        expect(departmentEmployeeCount.getDepartmentName()).toContain(departmentName);
        expect(departmentEmployeeCount.getStartDate()).toEqual(startDate);
        expect(departmentEmployeeCount.getEndDate()).toEqual(endDate);
        expect(departmentEmployeeCount.getDateStep()).toEqual(dateStep);
        expect(departmentEmployeeCount.getTimeseries()).toEqual([]);

        const departmentEmployeeCountTimeEpoc = new DepartmentEmployeeCountTimeEpoc(departmentName, startDate, endDate, 1);
        departmentEmployeeCount.addPoint(departmentEmployeeCountTimeEpoc);
        expect(departmentEmployeeCount.getTimeseries()).toEqual([departmentEmployeeCountTimeEpoc]);
        departmentEmployeeCount.addPoint(departmentEmployeeCountTimeEpoc);
        expect(departmentEmployeeCount.getTimeseries()).toEqual([departmentEmployeeCountTimeEpoc]);
    });
});
