namespace SnippetVault {
using Microsoft.AspNetCore.Mvc.Filters;
using System;

public class Authorize : Attribute {

}

public class AuthorizeFilter : Attribute, IActionFilter    {
    public void OnActionExecuted(ActionExecutedContext context)    {
        
    }

    public void OnActionExecuting(ActionExecutingContext context) {
        throw new System.NotImplementedException();
    }
}
}