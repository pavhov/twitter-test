import { Model, Schema } from "mongoose";

import connector        from "../../../lib/db/mongoose/connector";
import { TwitDocument } from "./Interface";


const Twit: Schema = new Schema({
    index: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    text: {
        type: Schema.Types.String,
        required: true,
    },
    lang: {
        type: Schema.Types.String,
        required: true,
    },
    source: {
        type: Schema.Types.String,
        required: true,
    },
    public_metrics: [{
        retweet_count: {
            type: Schema.Types.Number,
        },
        reply_count: {
            type: Schema.Types.Number,
        },
        like_count: {
            type: Schema.Types.Number,
        },
        quote_count: {
            type: Schema.Types.Number,
        },
    }],
    referenced_tweets: [{
        type: {
            type: Schema.Types.String,
        },
        id: {
            type: Schema.Types.String,
        },
    }],
    author_id: {
        type: Schema.Types.String,
        required: true,
    },
    next_token: {
        type: Schema.Types.String,
        required: true,
    },
    entities: {
        type: Schema.Types.Map,
    },
    created_at: {
        type: Schema.Types.Number,
        required: true,
    },
    updated_at: {
        type: Schema.Types.Number,
    },
    deleted_at: {
        type: Schema.Types.Number,
    },
    deleted: {
        type: Schema.Types.Boolean,
    },
}, {
    strict: true,
    minimize: true,
    autoIndex: true,
});


Twit.index({name: 1});
Twit.index({lang: 1});
Twit.index({source: 1});
Twit.index({index: 1, name: 1, lang: 1});
Twit.index({index: 1, name: 1, lang: 1, source: 1});
Twit.index({index: 1, name: 1, deleted: 1});

Twit.index({text: "text"});

export const projection: object = {
    index: 1,
    name: 1,
    text: 1,
    lang: 1,
    source: 1,
    public_metrics: 1,
    referenced_tweets: 1,
    author_id: 1,
    next_token: 1,
    entities: 1,
    created_at: 1,
};

export const options: object = {
    lean: true,
    new: true
};


export default <Model<TwitDocument>> connector.twitter.model("Twit", Twit, "twit");
