namespace SnippetVault {
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;


[Controller]
[Route("/api/v1/post")]
public class PostController {    
    private readonly IDBContext dbContext;

    public PostController(IDBContext _dbContext) {
        dbContext = _dbContext;
    }

    [HttpPost]
    [Route("snippet")]
    public async Task snippet([FromBody] CreateSnippetDTO dto) { 
        string lang1Str = HttpContext.Request.RouteValues["lang1"] as string;
        string lang2Str = HttpContext.Request.RouteValues["lang2"] as string;
        string tgStr = HttpContext.Request.RouteValues["taskGroup"] as string;
        if (!int.TryParse(lang1Str, out int lang1)) return;
        if (!int.TryParse(lang2Str, out int lang2)) return;
        if (!int.TryParse(tgStr, out int taskGroup)) return;

        await using (var cmd = new NpgsqlCommand(db.getQueries.snippet, db.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                await readResultSet<SnippetDTO>(reader, HttpContext.Response);
            }
        }
    }

}

}