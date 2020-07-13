import mongodb                                                               from "mongodb";
import { DocumentQuery, Query }                                              from "mongoose";
import { TwitConditions, TwitDocument, TwitInputData, TwitInterface }        from "./Interface";
import model, { options as defaultOptions, projection as defaultProjection } from "./Schema";


/**
 * @name addTwit

 * @description :: Server-side logic for add new Twit
 * @param data
 * @returns {Promise<*>}
 */
const addTwit = (...data: TwitInputData[]): Promise<TwitDocument | TwitDocument[]> => {
    return create(...data as TwitDocument[]);
};

/**
 * @name editTwit

 * @description :: Server-side logic for update Twit
 * @param condition
 * @param data
 * @param options
 * @returns {Promise<*|{}>}
 */
const editTwit = (condition: TwitConditions, data: TwitInputData, options?: any): DocumentQuery<TwitInterface, TwitDocument> => {
    return update(condition, data, options);
};

/**
 * @name removeTwit

 * @description :: Server-side logic for delete forever Twit
 * @param condition
 * @returns {Promise<*>}
 */
const removeTwit = (condition: TwitConditions): DocumentQuery<TwitInterface, TwitDocument> => {
    return update(condition, {deleted: true} as TwitInputData);
};

/**
 * @name recoverTwit

 * @description :: Server-side logic for recover removed or hidden Twit
 * @param condition
 * @returns {Promise<*>}
 */
const recoverTwit = (condition: TwitConditions): DocumentQuery<TwitInterface, TwitDocument> => {
    return update(condition, {deleted: false} as TwitInputData);
};

/**
 * @name destroyTwit

 * @description :: Server-side logic for remove or hide Twit
 * @param _id
 * @returns {Promise<*>}
 */
const destroyTwit = (_id: string): Query<mongodb.WriteOpResult["result"]> => {
    return model.remove({where: {_id}});
};

/**
 * @name getTotalTwits

 * @description
 * @returns {Promise<*>}
 */
const getTotalTwits = (): Query<number> => {
    return model.count({deleted: false});
};

/**
 * @name getTwit

 * @description :: Server-side logic for get one Twit
 * @param condition
 * @param projection
 * @param options
 * @returns {Promise<*>}
 */
const getTwit = (condition: TwitConditions, projection?: TwitInterface, options?: any): DocumentQuery<TwitInterface, TwitDocument> => {
    return model.findOne(condition, {...defaultProjection, ...projection}, {...defaultOptions, ...options});
};

/**
 * @name getTwits

 * @description :: Server-side logic for get Twits
 * @param condition
 * @param projection
 * @param options
 * @returns {Promise<*>}
 */
const getTwits = (condition?: TwitConditions, projection?: any, options?: any): DocumentQuery<TwitDocument | TwitInterface[], TwitDocument> => {
    return model.find(condition, {...defaultProjection, ...projection}, {...defaultOptions, ...options});
};

/**
 * @name paginateTwits

 * @description :: Server-side logic for get paginate Twits
 * @param condition
 * @param projection
 * @param options
 * @returns {Promise<*>}
 */
const paginateTwits = (condition?: TwitConditions, projection?: any, options?: any): DocumentQuery<TwitDocument | TwitInterface[], TwitDocument> => {
    // @ts-ignore
    return model.paginate(condition, (projection || defaultProjection), {...defaultOptions, ...options});
};

/**
 * @name update

 * @description :: Server-side logic for update sql data for Twit
 * @param condition
 * @param data
 * @param options
 * @returns {Promise<*[]>}
 */
const update = (condition: TwitConditions, data: TwitInputData, options?: any): DocumentQuery<TwitInterface, TwitDocument> => {
    let groupData: any = {};

    groupData = data;

    return model.findOneAndUpdate(condition, groupData, {...defaultOptions, ...options});
};

/**
 * @name create

 * @description :: Server-side logic for create sql data for Twit
 * @param data
 * @returns {Promise<*[]>}
 */
const create = (...data: TwitDocument[]): Promise<TwitDocument | TwitDocument[]> => {
    return model.create(...data);
};


export {
    addTwit,
    editTwit,
    destroyTwit,
    removeTwit,
    recoverTwit,
    getTotalTwits,
    getTwit,
    getTwits,
    paginateTwits,
};
