import pino from 'pino';

// const logger = pino({
//     customLevels: {
//       foo: 35
//     }
//   });

const consoleLogger = pino({
    transport: {
      pipeline: [{
        target: './pinoPipelineTransport.js'
      }, {
        // Use target: 'pino/file' to write to stdout
        // without any change.
        target: 'pino-pretty'
      }]
    }
});

export { consoleLogger };