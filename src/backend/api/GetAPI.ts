import Koa from "koa";
import Router from "koa-router";
import { API_PREFIX1 } from "../../common/web/Url";


const API_PREFIX = API_PREFIX1

const routerOpts: Router.IRouterOptions = {
    prefix: API_PREFIX,
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
    ctx.body = "GET ALLR1"
})


router.get("/foo", async (ctx: Koa.Context) => {
    ctx.body = "GET FOO23 45"
})


router.post("/pst", async (ctx: Koa.Context) => {
    ctx.body = "POST";
});

router.delete("/foo/:movie_id", async (ctx:Koa.Context) => {
    ctx.body = "DELETE";
});

router.patch("/foo/:movie_id", async (ctx:Koa.Context) => {
    ctx.body = "PATCH";
});

    // getDogs(): Promise<Dog[]> {
    //     return obj.map<Dog>('SELECT id, legs FROM Dog', [], a => new Dog(a));
    // }

    // class Dog {
    // constructor(row: any) {
    //     this.id = row.id;
    //     this.legs = row.legs;
    // }
    // id: number
    // legs: number
    // }

export default router;