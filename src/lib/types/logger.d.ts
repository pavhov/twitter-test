export default interface LoggerInterface {
    level: "info" | "debug" | "warning" | "error"

    Log(data, type?: this["level"]): void;
    Return(...data): void;
}

export interface LoggerOptions {
    level: "info" | "debug" | "warning" | "error"
}
