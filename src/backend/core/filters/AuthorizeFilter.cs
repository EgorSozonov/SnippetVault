namespace SnippetVault {
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Threading.Tasks;


public class AuthorizeFilter : Attribute, IAsyncActionFilter    {
    private readonly IAuthService authService;

    public AuthorizeFilter(IAuthService authService) {
        this.authService = authService;
    }

    public void OnActionExecuted(ActionExecutedContext context)    {

    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate continuation) {
        try {
            context.HttpContext.Request.Headers.TryGetValue("userId", out var userIdStrs);
            string userIdStr = userIdStrs.First();
            int.TryParse(userIdStr, out int userId);

            context.HttpContext.Request.Headers.TryGetValue("accessToken", out var accessTokens);
            if (accessTokens.Any()) {
                string accessToken = accessTokens.First();

                bool authorized = await authService.userAuthorize(userId, accessToken);
                if (!authorized) context.Result = new UnauthorizedResult();
            } else {
                context.Result = new UnauthorizedResult();
            }
        } catch (Exception) {
            context.Result = new BadRequestResult() {};
        }
        if (context.Result == null) await continuation();
    }
}
}
