import "./lib/global";

import Bootstrap       from "./lib/decorators/bootstrap";
import { error, info } from "./lib/util/logger";

import modules from "./module";

@Bootstrap
export default class Main {
    private tasks: Promise<any>[];

    public async main() {
        info("Starting application");
        try {
            this.tasks = this.module(modules);
            await Promise.all(this.tasks);
        } catch (e) {
            error(e);
        }
        info("gago end")
    }

    private module(modules: { [key: string]: {} | any }): Promise<any>[] {
        const swap: { [key: string]: {} | any } = modules;
        const res: Promise<any>[] = [];

        for (let name in swap) {
            if (swap.hasOwnProperty(name)) {
                const lswap: { [key: string]: {} | any } | any = swap[name];
                if (lswap.name == undefined) {
                    res.push(...this.module(lswap));
                } else {
                    res.push(Promise.resolve().then(() => (new lswap).Start()));
                }
            }
        }

        return res;
    }
}
