namespace SnippetVault {
using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;


class Program {
    static void Main(string[] args) {
        CreateWebHostBuilder(args).UseUrls("http://localhost:47000/").UseKestrel().Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
        Console.WriteLine("WebHostBuilder");
        return new WebHostBuilder()
            .ConfigureAppConfiguration((hostingContext, config) => {
                config.AddJsonFile("creds.json",
                    optional: false,
                    reloadOnChange: false);
            })
            .UseStartup<Launcher>();
    }
}

}
