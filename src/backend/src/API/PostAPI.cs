namespace SnippetVault {
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;



[Controller]
[Route("sv/api/v1/post")]
public class PostController {    
    private readonly IDBContext dbContext;

    public PostController(IDBContext _dbContext) {
        dbContext = _dbContext;
    }


    [HttpGet]
    [Route("Foo")]
    async public Task<string> foo() {
        await using (var cmd = new NpgsqlCommand("INSERT INTO data (some_field) VALUES (@p)", dbContext.conn)) {
            cmd.Parameters.AddWithValue("p", "Hello world");
            cmd.Prepare();
            await cmd.ExecuteNonQueryAsync();
        }
        return "foo";
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