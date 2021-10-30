import Koa from "koa";
import HttpStatus from "http-status-codes"


const App: Koa = new Koa()

App.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
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
App.use(async (ctx: Koa.Context) => {
    ctx.body = "Hello world"
})

// Application error logging.
App.on("error", console.error)

export default App