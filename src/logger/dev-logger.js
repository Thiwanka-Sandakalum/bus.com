const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const developmentFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const devLogger = () => {
  return createLogger({
    format: combine(
      label({ label: 'developmentLogger' }),
      timestamp(),
      developmentFormat
    ),
    transports: [new transports.Console({ level: 'info' })]
  });
};

const apiFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const apiLogger = createLogger({
  format: combine(
    timestamp(),
    apiFormat
  ),
  transports: [
    new transports.Console({ level: 'http', format: format.combine(format.colorize(), format.simple()) }),
    new transports.File({
      filename: 'api.log',
      level: 'http',
      format: format.json()
    })
  ]
});

module.exports = {
  devLogger,
  apiLogger
};
