import Koa from "koa";
import HttpStatus from "http-status-codes"
import router from "../api/GetAPI";


const SVServer: Koa = new Koa()

SVServer.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch (error: any) {
        ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit("error", error, ctx)
    }
})

// Initial route
// SVServer.use(async (ctx: Koa.Context) => {
//     ctx.body = "Hello world"
// })

// Application error logging.
SVServer.on("error", console.error)
SVServer.use(router.routes())
SVServer.use(router.allowedMethods())
export default SVServer