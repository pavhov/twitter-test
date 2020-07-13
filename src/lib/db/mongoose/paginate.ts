import { Document, Model, Schema, PaginateResult } from "mongoose";

let defaultOptions = {};

/**
 * @param {Object}              [query={}]
 * @param select
 * @param {Object}              [options={}]
 * @param {Object|String}         [options.select]
 * @param {Object|String}         [options.sort]
 * @param {Array|Object|String}   [options.populate]
 * @param {Boolean}               [options.lean=false]
 * @param {Boolean}               [options.leanWithId=true]
 * @param {Number}                [options.offset=0] - Use offset or page to set skip position
 * @param {Number}                [options.page=1]
 * @param {Number}                [options.limit=10]
 *
 * @returns {Promise}
 */
export async function paginate<T extends Model<Document<T>>>(this: T & { options: any }, query: any, select: string | any, options: any): Promise<PaginateResult<T> | void> {
    query = query || {};
    options = {...defaultOptions, ...options};
    let callback: (err?: Error, data?: {
        meta?: {
            count?: number;
            limit?: number;
            offset?: number;
            page?: number;
            pages?: number;
        },
        docs?: T[]
    }) => void = [].concat(...arguments).find(arg => arg instanceof Function);

    let sort: string | any = options.sort;
    let populate: string | any[] | any = options.populate;
    let lean: boolean = options.lean || false;
    let leanWithId: boolean = "leanWithId" in options ? options.leanWithId : true;

    let limit: number = "limit" in options ? options.limit : 10;
    let skip: number = 0;
    let offset: number = 0;
    let page: number = 0;

    if (options.hasOwnProperty("offset")) {
        offset = options.offset;
        skip = offset;
    } else if (options.hasOwnProperty("page")) {
        page = options.page;
        skip = (page - 1) * limit;
    } else {
        offset = 0;
        page = 1;
        skip = offset;
    }

    try {
        let result: PaginateResult<T> = {
            meta: {
                total: await this.countDocuments(query),
                limit,
                page,
            },
            docs: [],
        };

        if (offset !== undefined) {
            result.meta.offset = offset;
        }

        if (limit) {
            query = this.find(query).setOptions({
                select,
                sort,
                skip,
                limit,
                lean,
            });

            if (populate) {
                [].concat(populate).forEach(function (item: any) {
                    query.populate(item);
                });
            }

            if (lean && leanWithId) {
                result.docs = await query || [];
                result.docs.forEach(function (doc: T & { id: string; _id: any }) {
                    doc.id = String(doc._id);
                });
            } else {
                result.docs = await query || [];
            }

            result.meta.total = result.docs.length;
            result.meta.pages = Math.ceil(result.meta.total / limit) || 1;

            if (callback) {
                callback(null, result);
            } else {
                return result;
            }
        }
    } catch (e) {
        if (callback) {
            callback(e);
        } else {
            throw e;
        }
    }
}

export function setOptions(options: any): void {
    defaultOptions = options;
}

export default function (schema: Schema) {
    schema.statics.paginate = paginate;
}
