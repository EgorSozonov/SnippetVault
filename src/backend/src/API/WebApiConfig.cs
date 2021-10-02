using System.Web.Http;
namespace SnippetVault {


public static class WebApiConfig{
    public static void Register(HttpConfiguration config)    {
        config.MapHttpAttributeRoutes();
 
        config.Routes.MapHttpRoute(
            name: "BookRoute",
            routeTemplate: "api/v1/{controller}/{action}"
        );
         
        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/v1/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
    }
}
}