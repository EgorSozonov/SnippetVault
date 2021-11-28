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
    [Route("snippets/get/{lang1:int}/{lang2:int}/{taskGroup:int}")]
    public async Task snippet([FromRoute] int lang1, [FromRoute] int lang2, [FromRoute] int taskGroup) { 
        var result = await api.snippetsGet(taskGroup, lang1, lang2);
        await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("snippet/create")]
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
    [Route("languages/getGrouped")]
    public async Task languagesGrouped() {
        await HttpContext.Response.WriteAsJsonAsync(api.languagesGetGrouped());
    }

    [HttpGet]
    [Route("languages/get")]
    public async Task languages() {
        await HttpContext.Response.WriteAsJsonAsync(api.languagesGet());
    }

    [HttpGet]
    [Route("taskGroups")]
    public async Task taskGroup() {
        await HttpContext.Response.WriteAsJsonAsync(api.taskGroupsGet());
    }    

    [HttpGet]
    [Route("proposals")]
    public async Task proposals() {
        await HttpContext.Response.WriteAsJsonAsync(api.proposalsGet());
    }

    [HttpGet]
    [Route("task/{tgId:int}")]
    public async Task task([FromRoute] int tgId) {
        await HttpContext.Response.WriteAsJsonAsync(api.tasksFromGroupGet(tgId));
    }

    [HttpGet]
    [Route("taskGroupsForLanguage/{langId:int}")]
    public async Task taskGroupsForLanguage([FromRoute] int langId) {
        await api.taskGroupsForLangGet(langId);
    }

    [HttpGet]
    [Route("taskGroupsForLanguages/{langId1:int}/{langId2:int}")]
    public async Task taskGroupsForLanguages([FromRoute] int langId1, [FromRoute] int langId2) {
        await api.taskGroupsForLangsGet(langId1, langId2);
    }


    [HttpGet]
    [Route("alternatives/{tlId:int}")]
    public async Task alternative([FromRoute] int tlId) {
        await HttpContext.Response.WriteAsJsonAsync(api.alternativesForTLGet(tlId));
    }

    [HttpGet]
    [Route("comment/{snId:int}")]
    public async Task comment([FromRoute] int snId) {
        await HttpContext.Response.WriteAsJsonAsync(api.commentsGet(snId));
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