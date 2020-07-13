import { error } from "../util/logger";

export default function Bootstrap<T extends { new(...args: any[]): {} }>(constructor: T) {
    const t = class extends constructor {};

    try {
        const i: any = new t;
        // @ts-ignore
        i.main();
    } catch (e) {
        error(e);
    }

    return t;
}
