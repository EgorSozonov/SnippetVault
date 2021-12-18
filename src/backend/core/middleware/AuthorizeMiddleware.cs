using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
namespace SnippetVault {

public class AuthorizeMiddleware {
    private readonly RequestDelegate next;

    public AuthorizeMiddleware(RequestDelegate next) {
        this.next = next;
    }

    public async Task InvokeAsync(HttpContext context) {
        string token = context.Request.Headers["accessToken"];
        string userId = context.Request.Headers["userId"];
        if (token != "12345678") {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Token is invalid");
        } else {
            await next.Invoke(context);
        }
    }
}

}