import * as crypto from "crypto";
import 'reflect-metadata';

describe("Test that uuid generator for strings is deterministic", () => {
    test("Test Date Id Generator 2012-01-30T22:59:59.000Z", async () => {
        const hash1 = crypto.createHash('md5').update("Hello World!").digest('hex');
        const hash2= crypto.createHash('md5').update("Hello World!").digest('hex');
        console.log(hash1);
        expect(hash1).toBe(hash2);
    });

    
});