namespace SnippetVault {
using System;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

public class ExceptionMiddleware {
    private readonly RequestDelegate _next;
    private readonly LogService logger;

    public ExceptionMiddleware(RequestDelegate next, LogService logger) {
        _next = next;
        this.logger = logger;
    }

    public async System.Threading.Tasks.Task Invoke(HttpContext context) {
        try {
            await _next(context);
        } catch (Exception error) {
            await logger.error("SV", error.StackTrace ?? error.Message);
            var response = context.Response;
            response.ContentType = "application/json";
            response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var result = JsonSerializer.Serialize(new { message = error?.Message });
            await response.WriteAsync(result);
        }
    }
}

}
