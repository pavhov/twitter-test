import { info }          from "../../lib/util/logger";
import twit              from "../repository/twit/Stories";
import conf              from "../../conf/index";
import { TwitInterface } from "../repository/twit/Interface";

/**
 * @class Twit
 * @property {name} {string}
 * @method Start {Promise<void>}
 * @method Stop {Promise<void>}
 */
export default class Twit {
    public name: string = "Twit";

    private topics: string[] = [];

    public async Start() {
        info("Starting", this.name);
        this.topics = conf.env.topics;
        const story = twit;
        const stories: Promise<any>[] = [];

        for (let rowI = 0; rowI < this.topics.length; rowI++) {
            stories.push(story.tryGetTwits({name: this.topics[rowI]} as TwitInterface));
        }

        return Promise.all(stories);
    }

    public async Stop() {
        info("Stopping", this.name);
    }

}
