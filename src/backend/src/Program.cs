namespace SnippetVault {
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


class Program {
    static void Main(string[] args) {
        CreateWebHostBuilder(args)
            .UseUrls("http://localhost:47000/")
            .UseKestrel()
            .Build()
            .Run();
    }


    public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
        return new WebHostBuilder()
            .UseEnvironment(Microsoft.Extensions.Hosting.Environments.Development)
            
            //.UseWebRoot("/wwwroot")
            .ConfigureAppConfiguration((hostingContext, config) => {
                config.AddJsonFile("creds.json",
                    optional: false,
                    reloadOnChange: false);
            })
            .ConfigureServices(serviceCollection =>
                serviceCollection.AddScoped<IDBContext, DBContext>())
            .UseStartup<WebApp>();
    }
}

}
