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
        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.snippet, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, 0);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, 11);
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, 3);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                //cmd.Prepare();
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<SnippetDTO>(columnNames);
                    if (!readerSnippet.isOK) return "Reader error";

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") return errMsg;
                    return results.ToString();
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return e.Message;
                }
            }
        }
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