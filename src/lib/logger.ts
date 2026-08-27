import * as bunyan from "bunyan";

class Logger {
    logger: any;
    constructor(bunyanLogger) {
        this.logger = bunyanLogger;
    }
    trace = (msg) => {
        if (process.env.LOG_ENABLE_TRACE === 'true') {
            this.logger.trace(msg);
            console.log('\u001B[32mTrace - ' + msg + '\u001B[0m');
        }
    };
    error = (msg) => {
        this.logger.error(msg);
        console.error('\u001B[31mERROR - ' + msg + '\u001B[0m');
    };
};

let logger: Logger;

export function GetLogger(): Logger {
    if (!logger) {
        const traceStream = process.env.LOG_TARGET === 'file' ? { level: 'trace', path: './trace.log' } : { level: 'trace', stream: process.stdout };
        const errorStream = process.env.LOG_TARGET === 'file' ? { level: 'error', path: './error.log' } : { level: 'error', stream: process.stderr };
        logger = new Logger(bunyan.createLogger({
            name: 'golfapp-log',
            //streams: [traceStream, errorStream]
        }));
    }
    return logger;
}