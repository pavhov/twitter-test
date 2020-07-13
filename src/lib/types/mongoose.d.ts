/// <reference types="mongoose" />

import mongoose, { Connection as CConnection, Mongoose as CMongoose, Schema, Model as ExModel, Model, Document as ExDocument } from "mongoose";


export declare module "mongoose" {

    export let connections: Connection[];

    export interface Connection extends CConnection {
        host: string;
        name: string;
        replica: boolean;
        port: number;
        $dbName: string;
    }

    export interface Mongoose extends CMongoose {
        connections: Connection[]
    }

    interface HookSyncCallback<T> {
        (this: T, next: HookNextFunction): any;
    }

    interface HookAsyncCallback<T> {
        (this: T, next: HookNextFunction, done: HookDoneFunction): any;
    }

    export interface PaginateOptions {
        select?: Object | string;
        sort?: Object | string;
        populate?: Array<Object> | Array<string> | Object | string;
        lean?: boolean;
        leanWithId?: boolean;
        offset?: number;
        page?: number;
        limit?: number;
    }

    export interface PaginateResult<T> {
        docs: Array<T>;
        meta?: {
            total: number;
            limit: number;
            page?: number;
            pages?: number;
            offset?: number;
        };
    }

    export interface Document<T> extends ExDocument {
        _doc: T
    }

    export interface Model<T extends Document> extends ExModel<T> {

    }

    export interface PaginateModel<T extends Document> extends Model<T> {
        paginate(query?: T | any, options?: PaginateOptions, callback?: (err: any, result: PaginateResult<T>) => void): Promise<PaginateResult<T>>;
    }

    export function model<T extends Document>(
        name: string,
        schema?: Schema,
        collection?: string,
        skipInit?: boolean): PaginateModel<T>;

    export function model<T extends Document, U extends PaginateModel<T>>(
        name: string,
        schema?: Schema,
        collection?: string,
        skipInit?: boolean): U;

    export default mongoose;
}

declare module "mongoose-paginate" {
    import mongoose = require("mongoose");
    let _: (schema: mongoose.Schema) => void;
    export = _;
}
