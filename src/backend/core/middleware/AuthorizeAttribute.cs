using System.Web.Http.Filters;
using Microsoft.AspNetCore.Mvc;

namespace SnippetVault {
public class AuthorizeAttribute : TypeFilterAttribute {
    public AuthorizeAttribute(PermissionItem item, PermissionAction action) : base(typeof(AuthorizeActionFilter)) {
        Arguments = new object[] { item, action };
    }
}

public class AuthorizeActionFilter {
    private readonly PermissionItem _item;
    private readonly PermissionAction _action;
    
    public AuthorizeActionFilter(PermissionItem item, PermissionAction action){
        _item = item;
        _action = action;
    }
    public void OnAuthorization(AuthorizationFilterContext context) {
        bool isAuthorized = MumboJumboFunction(context.HttpContext.User, _item, _action); // :)

        if (!isAuthorized) context.Result = new ForbidResult();        
    }
}
}