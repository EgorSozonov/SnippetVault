using System;
namespace SnippetVault {


class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello World!");
         CreateWebHostBuilder(args).Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
}
}
