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
[Route("/api")]
public class MainController : Controller {
    private readonly IDataService api;
    private readonly IAuthService auth;
    public MainController(IDataService _api, IAuthService _auth) {
        this.api = _api;
        this.auth = _auth;
    }

    #region Snippets

    [HttpGet]
    [Route("snippets/{taskGroup:int}/{lang1:int}/{lang2:int}")]
    public async Task snippets([FromRoute] int taskGroup, [FromRoute] int lang1, [FromRoute] int lang2) {
        var result = await api.snippetsGet(taskGroup, lang1, lang2);
        await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("snippets/byCode")]
    public async Task snippetsByCode([FromQuery] string taskGroup, [FromQuery] string lang1, [FromQuery] string lang2) {
        var result = await api.snippetsGetByCode(taskGroup, lang1, lang2);
        await sendQueryResult<SnippetDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("proposal/create")]
    [ServiceFilter(typeof(AuthorizeFilter))]
    public async Task proposalCreate([FromBody] ProposalCreateDTO dto) {
        HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
        int.TryParse(mbUserId[0].ToString(), out int userId);
        await applyPostRequest(api.proposalCreate(dto, userId), HttpContext.Response);
    }

    [HttpPost]
    [Route("proposal/update")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task proposalUpdate([FromBody] ProposalUpdateDTO dto) {
        await applyPostRequest(api.proposalUpdate(dto), HttpContext.Response);
    }

    [HttpGet]
    [Route("snippet/{snId:int}")]
    public async Task proposalGet([FromRoute] int snId) {
        var result = await api.proposalGet(snId);
        await sendQueryResult<BareSnippetDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("snippet/approve/{snId:int}")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task snippetApprove([FromRoute] int snId) {
        await applyPostRequest(api.snippetApprove(snId), HttpContext.Response);
    }

    [HttpPost]
    [Route("snippet/decline/{snId:int}")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task snippetDecline([FromRoute] int snId) {
        await applyPostRequest(api.snippetDecline(snId), HttpContext.Response);
    }

    [HttpPost]
    [Route("snippet/markPrimary/{tlId:int}/{snId:int}")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task snippetMarkPrimary([FromRoute] int tlId, [FromRoute] int snId) {
        await applyPostRequest(api.snippetMarkPrimary(tlId, snId), HttpContext.Response);
    }

    [HttpGet]
    [Route("proposals")]
    public async Task proposals() {
        var result = await api.proposalsGet();
        await sendQueryResult<ProposalDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("alternatives/{tlId:int}")]
    public async Task alternatives([FromRoute] int tlId) {
        var result = await api.alternativesForTLGet(tlId, null);
        await sendQueryResult<AlternativesDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("alternativesForUser/{tlId:int}/{userId:int}")]
    public async Task alternativesForUser([FromRoute] int tlId, [FromRoute] int userId) {
        var result = await api.alternativesForTLGet(tlId, userId);
        await sendQueryResult<AlternativesDTO>(result, HttpContext.Response);
    }

    #endregion

    #region TasksLanguages

    [HttpGet]
    [Route("task/{taskId:int}")]
    public async Task task(int taskId) {
        var result = await api.taskGet(taskId);
        await sendQueryResult<TaskDTO>(result, HttpContext.Response);
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
    [Route("taskGroupsForLanguage/{langId:int}")]
    public async Task taskGroupsForLanguage([FromRoute] int langId) {
        var result = await api.taskGroupsForLangGet(langId);
        await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("taskGroupsForLanguages/{langId1:int}/{langId2:int}")]
    public async Task taskGroupsForLanguages([FromRoute] int langId1, [FromRoute] int langId2) {
        var result = await api.taskGroupsForLangsGet(langId1, langId2);
        await sendQueryResult<TaskGroupDTO>(result, HttpContext.Response);
    }

    #endregion

    #region Users

    [HttpGet]
    [Route("comments/{snId:int}")]
    public async Task comments([FromRoute] int snId) {
        var result = await api.commentsGet(snId);
        await sendQueryResult<CommentDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("user/register")]
    public async Task userRegister([FromBody] SignInDTO dto) {
        var result = await auth.userRegister(dto, HttpContext.Response.Cookies);
        await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("user/signIn")]
    public async Task userSignIn([FromBody] SignInDTO dto) {
        var result = await auth.userAuthenticate(dto);
        await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response, 401);
    }

    [HttpPost]
    [Route("user/changePw")]
    [ServiceFilter(typeof(AuthorizeFilter))]
    public async Task userChangePw([FromBody] ChangePwDTO dto) {
        var result = await auth.userUpdatePw(dto);
        await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("user/signInAdmin")]
    public async Task userSignInAdmin([FromBody] SignInAdminDTO dto) {
        var result = await auth.userAuthenticateAdmin(dto);
        await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response, 401);
    }

    [HttpPost]
    [Route("user/changeAdminPw")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task userChangeAdminPw([FromBody] ChangePwAdminDTO dto) {
        var result = await auth.userUpdateAdminPw(dto);
        await sendQueryResult<SignInSuccessDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("user/vote")]
    [ServiceFilter(typeof(AuthorizeFilter))]
    public async Task userVote([FromBody] VoteDTO dto) {
        HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
        int.TryParse(mbUserId[0].ToString(), out int userId);
        await applyPostRequest(api.userVote(dto, userId), HttpContext.Response);
    }

    [HttpPost]
    [Route("comment/cu")]
    [ServiceFilter(typeof(AuthorizeFilter))]
    public async Task commentCreate([FromBody] CommentCUDTO dto) {
        HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
        int.TryParse(mbUserId[0].ToString(), out int userId);
        await applyPostRequest(api.commentCreate(dto, userId), HttpContext.Response);
    }

    [HttpGet]
    [Route("user/profile")]
    [ServiceFilter(typeof(AuthorizeFilter))]
    public async Task userProfile() {
        HttpContext.Request.Headers.TryGetValue("userId", out var mbUserId);
        int.TryParse(mbUserId[0].ToString(), out int userId);
        var result = await api.userProfile(userId);
        await sendQueryResult<ProfileDTO>(result, HttpContext.Response);
    }

    #endregion

    #region Admin
    [HttpGet]
    [Route("task/all")]
    public async Task tasksAll() {
        var result = await api.tasksAll();
        await sendQueryResult<TaskCUDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("task/cu")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task taskCreateUpdate([FromBody] TaskCUDTO dto) {
        if (dto == null) return;
        await applyPostRequest(api.taskCU(dto), HttpContext.Response);
    }

    [HttpGet]
    [Route("taskGroup/all")]
    public async Task taskGroupsAll() {
        var result = await api.taskGroupsAll();
        await sendQueryResult<TaskGroupCUDTO>(result, HttpContext.Response);
    }

    [HttpGet]
    [Route("language/all")]
    public async Task languagesAll() {
        var result = await api.languagesAll();
        await sendQueryResult<LanguageCUDTO>(result, HttpContext.Response);
    }

    [HttpPost]
    [Route("language/cu")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task languageCreateUpdate([FromBody] LanguageCUDTO dto) {
        if (dto == null) return;
        await applyPostRequest(api.languageCU(dto), HttpContext.Response);
    }

    [HttpPost]
    [Route("taskGroup/cu")]
    [ServiceFilter(typeof(AuthorizeAdminFilter))]
    public async Task taskGroupCreateUpdate([FromBody] TaskGroupCUDTO dto) {
        if (dto == null) return;
        await applyPostRequest(api.taskGroupCU(dto), HttpContext.Response);
    }

    [HttpGet]
    [Route("admin/stats")]
    public async Task statsForAdmin() {
        var result = await api.statsForAdmin();
        await sendQueryResult<StatsDTO>(result, HttpContext.Response);
    }
    #endregion

    [HttpGet]
    [Route("health")]
    public async Task healthCheck() {
        await HttpContext.Response.WriteAsync("SnippetVault backend running at " + DateTime.Now);
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
