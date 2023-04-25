import { Logger } from "pino";
import { PassThrough } from "stream";


class StreamThrottle extends PassThrough {
    private delay: number;
    private logger: Logger;

    constructor(time: number, logger: Logger) {
        super({ objectMode: true });
        this.delay = time;
        this.logger = logger;
    }

    updateTimeout(time: number) {
        this.logger.info(`Updating timeout to: ${time}ms`);
        this.delay = time;
    }

    // Writes the data, push and set the delay/timeout
    _write(chunk: any, encoding: any, callback: () => void) {
        this.push(chunk);
        setTimeout(callback, this.delay);
    }

    // When all the data is done passing, it stops.
    _final() {
        this.push(null);
    }
}

export { StreamThrottle }