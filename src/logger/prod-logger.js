const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const productionFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const prodLoggr = () => {
  return createLogger({
    format: combine(
      label({ label: 'productionLogger' }),
      timestamp(),
      productionFormat
    ),
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.colorize(),
          format.simple()
        )
      }),
      new transports.File({
        filename: 'production.log',
        level: 'info',
        format: format.json()
      })
    ]
  });
};

module.exports = {
    prodLoggr
};
