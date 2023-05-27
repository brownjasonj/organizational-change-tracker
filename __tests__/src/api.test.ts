import 'reflect-metadata';
import supertest from 'supertest';
import { expressServer } from '../../src/expressServer';

const requestWithSupertest: supertest.SuperTest<supertest.Test> = supertest(expressServer);

describe(`Test API`, () => {
    test("Test getting configuration /operations/configuration", async () => {
        const res = await requestWithSupertest.get('/operations/configuration');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test("Test get employee by employee id /id/employee/{employeeId}", async () => {
        const res = await requestWithSupertest.get('/id/employee/1');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });
});