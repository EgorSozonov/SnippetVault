namespace SnippetVault {
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;



[Controller]
[Route("sv/api/v1/get")]
public class GetController {    
    private readonly IDBContext dbContext;


    public GetController(IDBContext _dbContext) {
        dbContext = _dbContext;
    }


    [HttpGet]
    [Route("snippet")]
    async public Task<string> snippet() {
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.language, dbContext.conn))
        await using (var reader = await cmd.ExecuteReaderAsync()) {
            try {
                while (await reader.ReadAsync()) {
                    Console.WriteLine(reader.GetString(1));
                }
            } catch (Exception e) {
                Console.WriteLine(e.Message);
            }
        }
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
        //   NpgsqlCommand command = new NpgsqlCommand("SELECT COUNT(*) FROM cities", conn);
        //   Int64 count = (Int64)command.ExecuteScalar();
}