namespace SnippetVault {

using Microsoft.AspNetCore.Mvc;


    //[RoutePrefix("sv/api/v1/Gett")]
[Controller]
[Route("sv/api/v1/Get")]
public class GetController {    
    private readonly IDBContext dbContext;

    public GetController(IDBContext _dbContext) {
        dbContext = _dbContext;
    }

    [HttpGet]
    [Route("Foo")]
    public string Foo() {
        return this.dbContext.getQueries.snippet;
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