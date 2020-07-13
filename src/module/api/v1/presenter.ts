import Router                      from "koa-router";
import { paginateTwits } from "../../repository/twit/Model";

const router = new Router();

router.post("/search", async (ctx, next) => {
    try {
        ctx.body = await paginateTwits(ctx.request.body.query, ctx.request.body.fields, ctx.request.body.meta);
    } catch (e) {
        ctx.status = 500;
        ctx.body = e;
    }
});


export default router.routes();
