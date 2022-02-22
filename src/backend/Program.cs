namespace SnippetVault {
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


class Program {
    static void Main(string[] args) {
        CreateWebHostBuilder(args)
            .UseUrls("http://localhost:10201/")
            .UseKestrel(o => o.UseSystemd())
            .Build()
            .Run()
            ;
    }


    public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
        return new WebHostBuilder()
            .UseEnvironment(Microsoft.Extensions.Hosting.Environments.Production)

            .ConfigureAppConfiguration((hostingContext, config) => {
                config.AddJsonFile("creds.json",
                optional: false,
                reloadOnChange: false);
            })
            .ConfigureServices(serviceCollection =>
                serviceCollection.AddScoped<IDBContext, DBContext>()
                                 .AddScoped<IDataService, DataService>()
                                 .AddScoped<IAuthService, AuthService>()
                                 .AddScoped<LogService>()
                                 .AddScoped<IStore, DBStore>()
                                 .AddScoped<AuthorizeFilter>()
                                 .AddScoped<AuthorizeAdminFilter>()
                                 .AddScoped<ExceptionMiddleware>()
                                 )
            .UseStartup<WebApp>();
    }
}

}
