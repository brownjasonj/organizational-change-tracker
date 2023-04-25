import build from 'pino-abstract-transport'
import { pipeline, Transform } from 'stream'

export default async function (options) {
  return build(function (source) {
    const myTransportStream = new Transform({
      // Make sure autoDestroy is set,
      // this is needed in Node v12 or when using the
      // readable-stream module.
      autoDestroy: true,

      objectMode: true,
      transform (chunk, enc, cb) {

        // modifies the payload somehow
        // chunk.service = 'pino'

        // stringify the payload again
        this.push(`${JSON.stringify(chunk)}\n`)
        cb()
      }
    })
    pipeline(source, myTransportStream, () => {})
    return myTransportStream
  }, {
    // This is needed to be able to pipeline transports.
    enablePipelining: true
  })
}
