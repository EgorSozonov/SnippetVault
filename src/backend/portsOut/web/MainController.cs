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
    private readonly IDataService api;
    private readonly IAuthService auth;
    public MainController(IDataService _api, IAuthService _auth) {
        this.api = _api;
        this.auth = _auth;
    }

    [HttpGet]
    [Route("snippets/{taskGroup:int}/{lang1:int}/{lang2:int}")]
    public async Task snippet([FromRoute] int lang1, [FromRoute] int lang2, [FromRoute] int taskGroup) { 
        var result = await api.snippetsGet(taskGroup, lang1, lang2);
        await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("proposal/create")]
    [AuthorizeFilter]
    public async Task proposalCreate([FromBody] CreateProposalDTO dto) {
        HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
        int.TryParse(mbUserId[0].ToString(), out int userId); 
        await applyPostRequest(api.proposalCreate(dto, userId), HttpContext.Response);        
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
        var result = await api.languagesGetGrouped();
        await sendQueryResult<LanguageGroupedDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("languages/get")]
    public async Task languages() {
        var result = await api.languagesGet();
        await sendQueryResult<LanguageDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("taskGroups")]
    public async Task taskGroup() {
        var result = await api.taskGroupsGet();
        await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
    }    

    [HttpGet]
    [Route("proposals")]
    public async Task proposals() {
        var result = await api.proposalsGet();
        await sendQueryResult<ProposalDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("task/{tgId:int}")]
    public async Task task([FromRoute] int tgId) {
        var result = await api.tasksFromGroupGet(tgId);
        await sendQueryResult<TaskDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("taskGroupsForLanguage/{langId:int}")]
    public async Task taskGroupsForLanguage([FromRoute] int langId) {
        var result = await api.taskGroupsGet();
        await api.taskGroupsForLangGet(langId);
    }

    [HttpGet]
    [Route("taskGroupsForLanguages/{langId1:int}/{langId2:int}")]
    public async Task taskGroupsForLanguages([FromRoute] int langId1, [FromRoute] int langId2) {
        var result = await api.taskGroupsGet();
        await api.taskGroupsForLangsGet(langId1, langId2);
    }


    [HttpGet]
    [Route("alternatives/{tlId:int}")]
    public async Task alternative([FromRoute] int tlId) {
        var result = await api.alternativesForTLGet(tlId);
        await sendQueryResult<AlternativeDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("comments/{snId:int}")]
    public async Task comments([FromRoute] int snId) {
        var result = await api.commentsGet(snId);
        await sendQueryResult<CommentDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("user/register")]
    public async Task userRegister([FromBody] UserSignInDTO dto) {
        var result = await auth.userRegister(dto.userName, dto.password);
        await sendQueryResult<SignInDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("user/signIn")]
    public async Task userSignIn([FromBody] UserSignInDTO dto) {
        var result = await auth.userAuthenticate(dto.userName, dto.password);
        await sendQueryResult<SignInDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("user/updatePw")]
    public async Task userUpdatePw([FromBody] UserSignInDTO dto) {
        var result = await auth.userAuthenticate(dto.userName, dto.password);
        await sendQueryResult<SignInDTO>(result, HttpContext.Response);
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