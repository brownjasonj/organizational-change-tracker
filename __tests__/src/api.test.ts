import 'reflect-metadata';
import supertest from 'supertest';
import { expressServer } from '../../src/expressServer';
import { GraphPersistenceFactory } from "../../src/persistence/GraphPersistenceFactory";
import { ConfigurationManager } from "../../src/ConfigurationManager";
import { ApplicationConfiguration } from "../../src/models/eom/configuration/ApplicationConfiguration";
import { BackEndConfiguration } from '../../src/models/eom/configuration/BackEndConfiguration';

const requestWithSupertest: supertest.SuperTest<supertest.Test> = supertest(expressServer);

describe(`Test API`, () => {
    beforeAll(async () => {
        ConfigurationManager.getInstance().setApplicationConfigurationFromFile("./__tests__/config/application-test-config.json");

        // get the application configuration
        const applicationConfiguration: ApplicationConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration();

        /*
            Set up the back end server according to the given configuration
        */
        const backEndConfiguration: BackEndConfiguration = applicationConfiguration.getBackEndConfiguration();

        GraphPersistenceFactory.setBackEndConfiguration(backEndConfiguration);
    });

    test("Test get employee by employee id /employee/1000001", async () => {
        const res = await requestWithSupertest.get('/employee/1000001');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /employee/1000001/corporateTitles", async () => {
        const res = await requestWithSupertest.get('/employee/1000001/corporateTitles');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /employee/1000001/departments", async () => {
        const res = await requestWithSupertest.get('/employee/1000001/departments');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/employees", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/employees');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/employeeCount", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/employeeCount');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeeCount?datestep=month", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeeCount?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeesJoiningLeaving", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesJoiningLeaving?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeesJoining", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesJoining?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /department/A/2010-01-01/2011-01-01/employeesLeaving", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesLeaving?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /departments/2010-01-01", async () => {
        const res = await requestWithSupertest.get('/department/A/2010-01-01/2011-01-01/employeesLeaving?datestep=month');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });
    
    test("Test getting configuration /operations/status/uploads", async () => {
        const res = await requestWithSupertest.get('/operations/status/uploads');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test getting configuration /operations/configuration", async () => {
        const res = await requestWithSupertest.get('/operations/configuration');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /id/employee-id/1000001", async () => {
        const res = await requestWithSupertest.get('/id/employee-id/1000001');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /id/employee-system-id/A0000001", async () => {
        const res = await requestWithSupertest.get('/id/employee-system-id/A0000001');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

});