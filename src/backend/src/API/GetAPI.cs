namespace SnippetVault {

using Microsoft.AspNetCore.Mvc;


    //[RoutePrefix("sv/api/v1/Gett")]
[Controller]
[Route("sv/api/v1/Get")]
public class GetController {    
    [HttpGet]
    [Route("Foo")]
    public string Foo() {
        return "Foo";
    }

    [Route("/")]
    public string Default() {
        return "Default";
    }

    [HttpGet] 
    [Route("Bar/{id:int}")]
    public string Bar(int id) {
        return "Ba " + id;
    }
}

}