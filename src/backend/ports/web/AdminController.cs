namespace SnippetVault {
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Npgsql;
using System;
using System.Web;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using System.IO;
using Microsoft.AspNetCore.Mvc;

[Controller]
[Route("/adminApi/v1")]
public class AdminController : Controller {
    private readonly IAdminAPI admApi;
    public AdminController(IAdminAPI _api) {
        this.admApi = _api;
    }

    [HttpPost]
    [Route("language/post")]
    public async Task language() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.language, db.conn)) { 
            //cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                 
                await readResultSet<LanguageDTO>(reader, HttpContext.Response);             
            }
        }
    }

    [HttpGet]
    [Route("taskGroup/post")]
    public async Task taskGroup() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.taskGroup, db.conn)) { 
            //cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<TaskGroupDTO>(reader, HttpContext.Response);                               
            }
        }
    }    

    [HttpGet]
    [Route("proposal/get")]
    public async Task proposal() {
        await using (var cmd = new NpgsqlCommand(db.getQueries.proposal, db.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<ProposalDTO>(reader, HttpContext.Response);                            
            }
        }
    }

    [HttpGet]
    [Route("task/{taskGroupId}")]
    public async Task task() {
        string tgIdStr = HttpContext.Request.RouteValues["taskGroupId"] as string;
        if (!int.TryParse(tgIdStr, out int tgId)) return;
        await using (var cmd = new NpgsqlCommand(db.getQueries.task, db.conn)) { 
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, tgId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<TaskDTO>(reader, HttpContext.Response);                            
            }
        }
    }

    [HttpGet]
    [Route("taskGroupsForLanguage/{langId1}")]
    public async Task taskGroupsForLanguage() {
        string paramStr = HttpContext.Request.RouteValues["langId"] as string;
        if (!int.TryParse(paramStr, out int langId)) return;
        await taskGroupsForArrayLanguages(new int[] {langId}, HttpContext);
    }

    [HttpGet]
    [Route("taskGroupsForLanguages/{langId1}/{langId2}")]
    public async Task taskGroupsForLanguages() {
        string paramStr1 = HttpContext.Request.RouteValues["langId1"] as string;
        string paramStr2 = HttpContext.Request.RouteValues["langId2"] as string;
        if (!int.TryParse(paramStr1, out int langId1)) return;
        if (!int.TryParse(paramStr2, out int langId2)) return;
        await taskGroupsForArrayLanguages(new int[] {langId1, langId2}, HttpContext);
    }


    private async Task taskGroupsForArrayLanguages(int[] langs, HttpContext context) {        
        await using (var cmd = new NpgsqlCommand(db.getQueries.taskGroupsForLanguages, db.conn)) { 
            cmd.Parameters.AddWithValue("ls", NpgsqlTypes.NpgsqlDbType.Array|NpgsqlTypes.NpgsqlDbType.Integer, langs);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                await readResultSet<TaskGroupDTO>(reader, HttpContext.Response);
            }
        }
    }

    [HttpGet]
    [Route("alternative/{taskLanguageId}")]
    public async Task alternative() {
        string paramStr = HttpContext.Request.RouteValues["taskLanguageId"] as string;
        if (!int.TryParse(paramStr, out int taskLanguageId)) return;
        await using (var cmd = new NpgsqlCommand(db.getQueries.task, db.conn)) { 
            cmd.Parameters.AddWithValue("tl", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<AlternativeDTO>(reader, HttpContext.Response);                            
            }
        }
    }

    [HttpGet]
    [Route("comment/{snippetId}")]
    public async Task comment() {
        string paramStr = HttpContext.Request.RouteValues["snippetId"] as string;
        if (!int.TryParse(paramStr, out int snippetId)) return;
        await using (var cmd = new NpgsqlCommand(db.getQueries.task, db.conn)) { 
            cmd.Parameters.AddWithValue("sn", NpgsqlTypes.NpgsqlDbType.Integer, snippetId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<CommentDTO>(reader, HttpContext.Response);                            
            }
        }
    }

    private static async Task readResultSet<T>(NpgsqlDataReader reader, HttpResponse response) where T : class, new() {
        try {                    
            string[] columnNames = new string[reader.FieldCount];
            for (int i = 0; i < reader.FieldCount; ++i) {
                columnNames[i] = reader.GetName(i);
            }
            var readerSnippet = new DBDeserializer<T>(columnNames);
            if (!readerSnippet.isOK)  {
                await response.WriteAsync("Error");
                return;
            }

            var results = readerSnippet.readResults(reader, out string errMsg);
            if (errMsg != "") {
                await response.WriteAsync(errMsg);
                return;
            }
            await response.WriteAsJsonAsync<List<T>>(results);
            return;
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            await response.WriteAsync("Exception");
            return;
        }  
    }
    
}

}