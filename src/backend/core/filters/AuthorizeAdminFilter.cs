namespace SnippetVault {
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Threading.Tasks;


public class AuthorizeAdminFilter : Attribute, IAsyncActionFilter    {
    private readonly IAuthService authService;

    public AuthorizeAdminFilter(IAuthService authService) {
        this.authService = authService;
    }

    public void OnActionExecuted(ActionExecutedContext context)    {
        
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate continuation) {
        try {
            context.HttpContext.Request.Headers.TryGetValue("accessToken", out var accessTokens);
            string accessToken = accessTokens.First();
            bool authorized = await authService.userAuthorizeAdmin(accessToken);
            if (!authorized) context.Result = new UnauthorizedResult();                        
        } catch (Exception) { context.Result = new BadRequestResult() {}; }

        if (context.Result == null) await continuation();
    }
}

}