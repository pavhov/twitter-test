import { Document } from "mongoose";

/**
 * @interface TwitConditions
 * @extends TwitInterface
 */
export interface TwitConditions extends TwitInterface {
    [ksy: string]: TwitInterface | any
}

/**
 * @interface TwitInputData
 * @extends TwitInterface
 */
export interface TwitInputData extends TwitInterface {
    [ksy: string]: TwitInterface | any
}

/**
 * @interface TwitInterface
 */
export interface TwitInterface {
    id?: string | any;
    _id?: string | any;
    index?: string | any;
    name?: string | any;
    text?: string | any;
    lang?: string | any;
    source?: string | any;
    public_metrics?: {
        retweet_count: number | any;
        reply_count: number | any;
        like_count: number | any;
        quote_count: number | any;
    } | any;
    referenced_tweets?: {
        type: string | any;
        id: string | any;
    }[] | any;
    author_id?: string | any;
    next_token?: string | any;
    entities?: any;
    created_at?: number | any;
    updated_at?: number | any;
    deleted_at?: number | any;
    deleted?: boolean | any;
}

/**
 * @interface TwitDocument
 * @extends TwitInterface, mongoose.Document
 */
export interface TwitDocument extends TwitInterface, Document {
}
