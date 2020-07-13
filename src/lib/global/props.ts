import "reflect-metadata";

const stack = function () {
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    let err = new Error;
    // @ts-ignore
    Error.captureStackTrace(err, err);
    let stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
};

const line = function () {
    // @ts-ignore
    return global.__stack[3].getLineNumber();
};

const moduleFn = function () {
    // @ts-ignore
    return global.__stack[3].getFileName();
};

const functionFn = function () {
    // @ts-ignore
    return global.__stack[3].getFunctionName();
};

export default (() => {
    Object.defineProperty(global, "__stack", {get: stack});

    Object.defineProperty(global, "__line", {get: line});

    Object.defineProperty(global, "__module", {get: moduleFn});

    Object.defineProperty(global, "__function", {get: functionFn});

})();
