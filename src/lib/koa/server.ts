import Koa        from "koa";
import Router     from "koa-router";
import BodyParser from "koa-bodyparser";

import conf            from "../../conf";
import { error, info } from "../util/logger";

const router = new Router();

const use = (...routs: Router.IMiddleware[]) => {
    router.use(...routs);

};
const serve = () => new Promise((resolve, reject) => {
    const app = new Koa();
    app
        .use(BodyParser())
        .use(router.routes())
        .use(router.allowedMethods());
    const srv = app.listen(conf.env.koa_port, conf.env.koa_hostname);

    srv.on("listening", () => {
        info(srv.address());
        resolve();
    }).on("error", (err: Error) => {
        error(err);
        reject(err);
    });
});

export {
    use,
    serve,
};
