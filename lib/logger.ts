import { createLogger, transports } from 'winston'
import { ConsoleTransportOptions } from 'winston/lib/winston/transports'

const logLevel = process.env.LOG_LEVEL
const consoleTransportConfig: ConsoleTransportOptions = {
  handleExceptions: true,
}
if (logLevel) {
  consoleTransportConfig.level = logLevel
}
const logger = createLogger({
  defaultMeta: { service: 'cavapi' },
  transports: [
    new transports.Console(consoleTransportConfig),
  ],
  exitOnError: false,
})
export default logger