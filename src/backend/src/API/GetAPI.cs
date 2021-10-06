namespace SnippetVault {
using System.Web.Http;

[Route("api/v1/[controller]")]
public partial class GetController : ApiController {
    [HttpGet]
    public string Foo() {
        return "Foo";
    }

    [HttpGet]
    public string Bar(int id) {
        return "Ba " + id;
    }
}

}