import Koa from "koa";
import Router from "koa-router";
import BodyParser from "koa-bodyparser";
import { debug } from "../util/logger";

const key = Symbol("app");
const koa: {
    [key: string]: {
        app: Koa;
        router: { [key: string]: Router };
    }
} | any = {[key]: {}};

export function App(options: { path: string | string[] }) {
    koa[key].app = (new Koa()) as any;
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        koa[key].app.use(BodyParser());
        constructor.prototype.koa = koa[key].app as any;
        let approuter = new Router();
        let commonRouter = new Router();
        for (let name in koa[key].router) {
            let router = koa[key].router[name];
            let baseRouter = new Router();
            baseRouter.use(router.path, router.route.routes(), router.route.allowedMethods());
            commonRouter.use(baseRouter.routes());
        }
        approuter.use(options.path, commonRouter.routes());
        koa[key].app.use(approuter.routes());
        approuter.stack.forEach(value => {
            debug({path: value.path, methods: value.methods, stack: value.stack.length});
        });
    };
}

export function Use(fn: any | any[], options?: { name?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        Middleware("before", target, propertyName, fn, options);
        Middleware("after", target, propertyName, fn, options);
    };
}

export function Before(fn: any | any[], options?: { name?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Middleware("before", target, propertyName, fn, options);
    };
}

export function After(fn: any | any[], options?: { name?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Middleware("after", target, propertyName, fn, options);
    };
}


export function Presenter(options: { path: string | string[] }) {
    if (!koa[key].router) {
        koa[key].router = {};
    }
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        koa[key].router[constructor.name] = {path: options.path, route: new Router()};
        for (let name in constructor.prototype.routes) {
            let route: { path: string; method: string; before: any; handler: any; after: any; } = (new constructor as any).routes[name];
            koa[key].router[constructor.name].route[route.method](route.path,
                ...(MiddlewareHandler("before", route.before)), route.handler, ...(MiddlewareHandler("after", route.after)),
                koa[key].router[constructor.name].route.allowedMethods());
        }
    };
}


export function Get(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("get", target, propertyName, descriptor.value, options);
    };
}

export function Post(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("post", target, propertyName, descriptor.value, options);
    };
}

export function Put(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("put", target, propertyName, descriptor.value, options);
    };
}

export function Patch(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("patch", target, propertyName, descriptor.value, options);
    };
}

export function Header(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("header", target, propertyName, descriptor.value, options);
    };
}

export function Delete(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        Method("delete", target, propertyName, descriptor.value, options);
    };
}


function Middleware(name: string, target: any, propertyName: string, handler: any | any[], options: any) {
    if (!target.routes) {
        target.routes = Object();
    }
    if (!target.routes[propertyName]) {
        target.routes[propertyName] = {};
    }
    if (!target.routes[propertyName][name]) {
        target.routes[propertyName][name] = [];
    }
    if (handler instanceof Array) {
        for (let rowI = 0; rowI < handler.length; rowI++) {
            target.routes[propertyName][name].push(handler[rowI] || options.name);
        }
    } else {
        target.routes[propertyName][name].push(handler || options.name);
    }
}

function Method(name: string, target: any, propertyName: string, handler: any, options: any) {
    if (!target.routes) {
        target.routes = {};
    }
    target.routes[propertyName] = {...target.routes[propertyName], path: propertyName, method: name, handler: handler, ...options};
}


function MiddlewareHandler(useCase: string, routes: any[] = []): any[] {
    const result = [];

    for (let rowI = 0; rowI < routes.length; rowI++) {
        let route = routes[rowI];
        let m = (new route as any);
        result.push(m[useCase].bind(m));
    }

    return result;
}
