
import pino from "pino";
import ENV from '../../server/http/env'

class LoggerAdapter {
    private logger: pino.Logger;

    constructor() {
        this.logger = pino({
            name: "ports-and-adapter-api",
            level: ENV.environment == 'test' ? 'debug' : 'info',
            transport: {
                target: 'pino-pretty'
            }
        });
    }

    public info(message: string, data?: Record<string, unknown>) {
        this.logger.info(message, data);
    }

    public error(message: string, data?: Record<string, unknown>) {
        this.logger.error(message, data);
    }

    public warn(message: string, data?: Record<string, unknown>) {
        this.logger.warn(message, data);
    }

    public debug(message: string, data?: Record<string, unknown>) {
        this.logger.debug(message, data);
    }

    public fatal(message: string, data?: Record<string, unknown>) {
        this.logger.fatal(message, data);
    }

}

export const Logger = new LoggerAdapter()