namespace SnippetVault {
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller {
    private readonly IAPI api;
    public HomeController(IAPI _api) {
        this.api = _api;
    }
    
    // [HttpGet]
    // [Route("/")]
    // public async Task homePage(HttpContext context) {
    //     var indexHtml = api.homePageGet();
    //     await context.Response.WriteAsync(indexHtml);
    // }
}

}