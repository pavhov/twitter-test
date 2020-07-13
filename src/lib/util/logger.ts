import { stringify }        from "json5";
import Debug, { IDebugger } from "debug";
import { json }             from "./parser";
import conf                 from "../../conf";
import LoggerInterface      from "../types/logger";

const logger: IDebugger = Debug("");

export const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};

const Log = (level: LoggerInterface["level"]): LoggerInterface["Return"] => {
    const loglevel = conf.env.app_debug_level;
    return (...data: any[]): void => {
        // @ts-ignore
        const moduleFile = `${global.__module}:${global.__line}`;
        const message: any = (
            (loglevel === "error" && data.filter(value => value instanceof Error) && data) ||
            (level === "warning" && loglevel === level && data.filter(value => "warning" in value) && data) ||
            (loglevel === "debug" && [level, "debug", "error", "warning"].includes(loglevel) && data) ||
            (loglevel === "info" && [level, "error"].includes(loglevel) && [data[0], data[1]])
        );
        if (message) {
            logMessage(level, moduleFile, message);
        }
    };
};

export const error = Log("error");

export const warning = Log("warning");

export const debug = Log("debug");

export const info = Log("info");

const buildLog = (message: any[] | any): string[] | string | any => {
    return json.stringify(message);
};

const logMessage = (level: LoggerInterface["level"], moduleFile: string, message: any) => {
    let hasError = message[0] instanceof Error;
    let dateNow = new Date();
    let result = "";

    if (hasError) {
        level = "error";
        result = stringify([{
            name: `[${message[0].name}] \n`,
            message: `[${message[0].message}] \n`,
            stack: `[${message[0].stack}] \n`,
        }]);
    } else {
        result = buildLog(message);
    }
    return logger(colors.Reset, (hasError && colors.FgRed || colors.FgGreen),
        stringify([{
            time: `[${dateNow.toUTCString()}]`,
            level: `[${level}]`,
            caller: `[${moduleFile}]`,
            message: `${result}`,
        }]),
        colors.Reset);
};


export default Log;
