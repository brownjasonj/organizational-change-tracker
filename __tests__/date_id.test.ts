import { dateIdGenerator } from "../src/utils/dateIdGenerator";
import "@types/jest";

describe("Date Id Generator Testing", () => {
    test("Test Date Id Generator 2012-01-01T00:00:00.000Z", async () => {
        expect(dateIdGenerator(new Date("2012-01-01T00:00:00.000Z"))).toBe("20120101000000");
    });

    test("Test Date Id Generator 2012-01-30T22:59:59.000Z", async () => {
        expect(dateIdGenerator(new Date("2012-01-30T22:59:59.000Z"))).toBe("20120130225959");
    });

    
});