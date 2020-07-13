import {connect} from "../../../lib/db/mongoose/connector";
import { info } from "../../../lib/util/logger";

/**
 * @class Common
 * @property {name} {string}
 * @method Start {Promise<void>}
 * @method Stop {Promise<void>}
 */
export default class Common {
    public name: string = "Common";

    public async Start() {
        info("Starting", {repository: this.name});
        return connect();
    }

    public async Stop() {
        info("Stopping", this.name);
    }
}
