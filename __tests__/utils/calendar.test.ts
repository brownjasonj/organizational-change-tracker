import { Calendar } from "../../src/utils/Calendar";

describe("Calendar Testing", () => {
    test("Given a date 2012-01-01T14:30:59Z, getStartOfDate should set time to 00:00:00", async () => {
        const date = new Date("2012-01-01T14:30:59Z");
        const startOfDay = Calendar.getStartOfDay(date);
        expect(startOfDay.toISOString()).toBe("2012-01-01T00:00:00.000Z");
    });
    
    test("Given a date 2012-01-01T14:30:59Z, getEndOfDate should set time to 23:59:59", async () => {
        const date = new Date("2012-01-01T14:30:59Z");
        const endOfDay = Calendar.getEndOfDay(date);
        expect(endOfDay.toISOString()).toBe("2012-01-01T23:59:59.000Z");
    });

    test("Given a date 2012-01-01T14:30:59Z, getStartOfNextDay should set time to 00:00:00 of the next day", async () => {
        const date = new Date("2012-01-01T14:30:59Z");
        const startOfNextDay = Calendar.getStartOfNextDay(date);
        expect(startOfNextDay.toISOString()).toBe("2012-01-02T00:00:00.000Z");
    });

    test("Given a date 2012-01-13T14:30:59Z, getStartOfMonth should set day to start of the month and time to 00:00:00 ", async () => {
        const date = new Date("2012-01-13T14:30:59Z");
        const startOfMonth = Calendar.getStartOfMonth(date);
        expect(startOfMonth.toISOString()).toBe("2012-01-01T00:00:00.000Z");
    });

    test("Given a date 2012-01-13T14:30:59Z, getEndOfMonth should set day to end of the month and time to 23:59:59 ", async () => {
        const date = new Date("2012-01-13T14:30:59Z");
        const endOfMonth = Calendar.getEndOfMonth(date);
        expect(endOfMonth.toISOString()).toBe("2012-01-31T23:59:59.000Z");
    });

    test("Given a date 2012-01-13T14:30:59Z, getEndofNextDay should set day to end of the next day and time to 23:59:59 ", async () => {
        const date = new Date("2012-01-13T14:30:59Z");
        const endOfNextDay = Calendar.getEndOfNextDay(date, 1);
        expect(endOfNextDay.toISOString()).toBe("2012-01-14T23:59:59.000Z");
    });

    test("Given two dates with different times, but same date, the isSameDay should return true", async () => {
        const date1 = new Date("2012-01-13T14:30:59Z");
        const date2 = new Date("2012-01-13T23:59:59Z");
        expect(Calendar.isSameDay(date1, date2)).toBe(true);
    });
});
