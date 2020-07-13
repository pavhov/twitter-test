import { error } from "./logger";

const parse = (text: string, reviver?: (this: any, key: string, value: any) => any): any => {
    try {
        return JSON.parse(text, reviver);
    } catch (e) {
        error("JSON.parse:error", e);
    }
    return null;
};

const stringify = (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string => {
    try {
        return JSON.stringify(value, replacer, space);
    } catch (e) {
        error("JSON.stringify:error", e);
    }
    return null;
};

export const json = {parse, stringify};
