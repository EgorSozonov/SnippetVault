namespace SnippetVault {
using System.Web.HttpApplication

public class SnippetVault : System.Web.HttpApplication
{
    protected void Application_Start()
    {
        GlobalConfiguration.Configure(WebApiConfig.Register);
        //......................................
    }
}
}