namespace SnippetVault {
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Npgsql;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Routing;
using System.IO;
using Microsoft.AspNetCore.Mvc;


[Controller]
[Route("/api/v1")]
public class MainController : Controller {
    private readonly IAPI api;
    public MainController(IAPI _api) {
        this.api = _api;
    }

    [HttpGet]
    [Route("snippet/get/{lang1:int}/{lang2:int}/{taskGroup:int}")]
    public async Task snippet([FromRoute] int lang1, [FromRoute] int lang2, [FromRoute] int taskGroup) { 
        // string lang1Str = HttpContext.Request.RouteValues["lang1"] as string;
        // string lang2Str = HttpContext.Request.RouteValues["lang2"] as string;
        // string tgStr = HttpContext.Request.RouteValues["taskGroup"] as string;
        // if (!int.TryParse(lang1Str, out int lang1)) return;
        // if (!int.TryParse(lang2Str, out int lang2)) return;
        // if (!int.TryParse(tgStr, out int taskGroup)) return;
        await HttpContext.Response.WriteAsJsonAsync(api.snippetsGet(taskGroup, lang1, lang2));
    }

    [HttpGet]
    [Route("language/get")]
    public async Task language() {
        await HttpContext.Response.WriteAsJsonAsync(api.languagesGet());
    }

    [HttpGet]
    [Route("taskGroup/get")]
    public async Task taskGroup() {
        await HttpContext.Response.WriteAsJsonAsync(api.taskGroupsGet());
    }    

    [HttpGet]
    [Route("proposal/get")]
    public async Task proposal() {
        await HttpContext.Response.WriteAsJsonAsync(api.proposalsGet());
    }

    [HttpGet]
    [Route("task/{taskGroupId}")]
    public async Task task() {
        string tgIdStr = HttpContext.Request.RouteValues["taskGroupId"] as string;
        if (!int.TryParse(tgIdStr, out int tgId)) return;
        await HttpContext.Response.WriteAsJsonAsync(api.tasksFromGroupGet(tgId));
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
        await HttpContext.Response.WriteAsJsonAsync(api.alternativesForTLGet(taskLanguageId));
    }

    [HttpGet]
    [Route("comment/{snippetId}")]
    public async Task comment() {
        string paramStr = HttpContext.Request.RouteValues["snippetId"] as string;
        if (!int.TryParse(paramStr, out int snippetId)) return;
        await HttpContext.Response.WriteAsJsonAsync(api.commentsGet(snippetId));
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
    
    public static async Task homePage(HttpContext context) {
        var indexHtml = System.IO.File.ReadAllText("target/StaticFiles/index.html");
        await context.Response.WriteAsync(indexHtml);
    }
}

}