import { info } from "../../../lib/util/logger";
import Schema   from "./Schema";

/**
 * @class Twit
 * @property {name} {string}
 * @method Start {Promise<void>}
 * @method Stop {Promise<void>}
 */
export default class Twit {
    public name: string = "Twit";

    public async Start() {
        info("Starting", {repository: this.name}, {schema: Schema.modelName});
    }

    public async Stop() {
        info("Stopping", this.name);
    }
}
