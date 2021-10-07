namespace SnippetVault {

using Microsoft.AspNetCore.Mvc;


    //[RoutePrefix("sv/api/v1/Gett")]
    [Controller]
public partial class GetController {
    [HttpGet]
    [Route("sv/api/v1/Get/Foo")]
    public string Foo() {
        return "Foo";
    }

    [Route("/")]
    public string Default() {
        return "Default";
    }

    [HttpGet] 
    [Route("sv/api/v1/Get/Bar/{id:int}")]
    public string Bar(int id) {
        return "Ba " + id;
    }
}

}