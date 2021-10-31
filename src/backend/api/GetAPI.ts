import Koa from "koa";
import Router from "koa-router";
import { API_PREFIX1 } from "../../common/web/Url";


const API_PREFIX = API_PREFIX1

const routerOpts: Router.IRouterOptions = {
    prefix: API_PREFIX,
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx:Koa.Context) => {
    ctx.body = "GET ALL";
});

router.get("/:movie_id", async (ctx: Koa.Context) => {
    ctx.body = "GET SINGLE " + ctx.params.movie_id;
});

router.post("/", async (ctx:Koa.Context) => {
    ctx.body = "POST";
});

router.delete("/:movie_id", async (ctx:Koa.Context) => {
    ctx.body = "DELETE";
});

router.patch("/:movie_id", async (ctx:Koa.Context) => {
    ctx.body = "PATCH";
});

export default router;