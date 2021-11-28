namespace SnippetVault {
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Npgsql;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Routing;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using static HttpUtils;


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
        Console.WriteLine($"lang1 {lang1} lang2 {lang2} tg {taskGroup}");
        var result = await api.snippetsGet(taskGroup, lang1, lang2);
        await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("snippet/add")]
    public async Task snippet([FromBody] CreateSnippetDTO dto) {
        await applyPostRequest(api.snippetAdd(dto), HttpContext.Response);        
    }

    [HttpPost]
    [Route("snippet/approve/{snId:int}")]
    public async Task snippetApprove([FromRoute] int snId) {
        await applyPostRequest(api.snippetApprove(snId), HttpContext.Response);        
    }

    [HttpPost]
    [Route("snippet/delete/{snId:int}")]
    public async Task snippetDelete([FromRoute] int snId) {
        await applyPostRequest(api.snippetDelete(snId), HttpContext.Response);        
    }

    [HttpPost]
    [Route("snippet/markPrimary/{tlId:int}/{snId:int}")]
    public async Task snippetMarkPrimary([FromRoute] int tlId, [FromRoute] int snId) {
        await applyPostRequest(api.snippetMarkPrimary(tlId, snId), HttpContext.Response);        
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
    [Route("taskGroupsForLanguage/{langId:int}")]
    public async Task taskGroupsForLanguage() {
        string paramStr = HttpContext.Request.RouteValues["langId"] as string;
        if (!int.TryParse(paramStr, out int langId)) return;
        await api.taskGroupsForLangGet(langId);
    }

    [HttpGet]
    [Route("taskGroupsForLanguages/{langId1}/{langId2}")]
    public async Task taskGroupsForLanguages() {
        string paramStr1 = HttpContext.Request.RouteValues["langId1"] as string;
        string paramStr2 = HttpContext.Request.RouteValues["langId2"] as string;
        if (!int.TryParse(paramStr1, out int langId1)) return;
        if (!int.TryParse(paramStr2, out int langId2)) return;
        await api.taskGroupsForLangsGet(langId1, langId2);
    }


    [HttpGet]
    [Route("alternative/{taskLanguageId:int}")]
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

}

}