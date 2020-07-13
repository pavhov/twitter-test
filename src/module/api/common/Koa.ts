import { use, serve } from "../../../lib/koa/server";
import { info }       from "../../../lib/util/logger";

import API from "../v1";

/**
 * @class Koa
 * @property {name} {string}
 * @method Start {Promise<void>}
 * @method Stop {Promise<void>}
 */
export default class Koa {
    public name: string = "Koa";

    public async Start() {
        info("Starting", {repository: this.name});
        use(...API.presenter);
        return serve();
    }

    public async Stop() {
        info("Stopping", this.name);
    }
}
