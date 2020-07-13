import * as util       from "util";
import moment          from "moment";
import { CoreOptions } from "request";
import request         from "request-promise-native";

import { TwitConditions, TwitInputData, TwitInterface } from "./Interface";
import { addTwit, getTwit }                             from "./Model";
import conf                                             from "../../../conf/index";
import { error, info }                                  from "../../../lib/util/logger";
import { json }                                         from "../../../lib/util/parser";

const setTimeoutPromise = util.promisify(setTimeout);

/**
 * @name tryGetTwits
 *
 * @param data
 */
const tryGetTwits = async (data: TwitInterface) => {
    info("Twit", data);
    const day = moment().subtract(7, "days");

    const conditions: TwitConditions = {
        name: data.name,
        created_at: {
            $gte: day.unix(),
        }
    };
    const config: CoreOptions = {
        headers: {
            "Authorization": `Bearer ${conf.env.twitter_bearer}`,
        },
        qs: {
            start_time: day.toISOString(),
            // end_time: "",
            // since_id: "",
            // until_id: "",
            max_results: 10,
            // next_token: "",
            // expansions: "",
            "tweet.fields": "attachments,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets,source,public_metrics,text,withheld",
            // "media.fields": "",
            // "place.fields": "",
            // "poll.fields": "",
            // "user.fields": "",
            query: data.name,
        }
    };

    try {
        let options = {
            count: 0,
            duplicates: false,
            continues: true,
        };

        do {
            await setTimeoutPromise(5000);
            const twit = await getTwit(conditions, null, {$orderby: {_id: -1}});
            if (twit != null) {
                if (options.duplicates === false) {
                    config.qs.since_id = twit.index;
                    config.qs.start_time = undefined;
                    config.qs.next_token = undefined;
                } else {
                    config.qs.since_id = undefined;
                    config.qs.next_token = twit.next_token;
                    config.qs.start_time = (new Date(twit.created_at)).toISOString();
                }
            }

            info([config.qs.since_id, config.qs.next_token, config.qs.start_time, options.count]);

            try {
                const body = await request.get(conf.env.twitter_api, config);
                const result = json.parse(body);

                if (result == null || result.meta.result_count === 0 || options.count > 200) {
                    await setTimeoutPromise(10000);
                    [options.count, options.continues, options.duplicates] = [0, true, false];
                    continue;
                }

                let lastTwit = result.data && result.data[result.data.length - 1];

                options.count += result.meta.result_count;
                if (lastTwit) {
                    config.qs.start_time = (new Date(lastTwit.created_at)).toISOString();
                }

                if (result.meta.next_token) {
                    config.qs.since_id = undefined;
                    config.qs.next_token = result.meta.next_token;
                } else {
                    config.qs.start_time = undefined;
                    config.qs.since_id = result.meta.newest_id;
                    result.meta.next_token = config.qs.next_token || (twit && twit.next_token);
                }

                try {
                    await saveTwits(result, data, options);
                } catch (e) {
                    error(e);
                }
            } catch (e) {
                await setTimeoutPromise(1024*60*15);
                error(e);
            }
        } while (options.continues);
    } catch (e) {
        error(e);
    }
};

const saveTwits = async (twits: any, data: TwitInterface, options: any) => {
    twits.data = new Proxy(twits.data, {
        get(target: any, p: PropertyKey, receiver: any): any {
            if (typeof target[p] == "object") {
                const swap: TwitInputData = {};
                swap.index = target[p].id;
                swap.name = data.name;
                swap.text = target[p].text;
                swap.lang = target[p].lang;
                swap.source = target[p].source;
                swap.public_metrics = target[p].public_metrics;
                swap.referenced_tweets = target[p].referenced_tweets;
                swap.author_id = target[p].author_id;
                swap.next_token = twits.meta.next_token;
                swap.entities = target[p].entities;
                swap.created_at = (new Date(target[p].created_at)).getTime();
                target[p] = swap;
            }

            return target[p];
        }
    });

    for (let rowI = 0; twits.data.length > rowI; rowI++) {
        try {
            await addTwit(twits.data[rowI]);
        } catch (e) {
            options.duplicates = true;
            error(e);
        }
    }
};


export default {
    tryGetTwits,
};
