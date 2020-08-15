const log4js = require("log4js");
var appRoot = require("app-root-path");
log4js.configure({
  appenders: {
    out: {
      type: "stdout",
    },
    app: {
      type: "file",
      filename: `${appRoot}/app.log`,
      maxLogSize: 10485760,
      backups: 1,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ["out", "app"],
      level: "debug",
    },
  },
});

const logger = log4js.getLogger();
logger.debug("Logger Level On : ", "debug");
module.exports = logger;
