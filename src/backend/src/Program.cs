namespace SnippetVault {
using System;
using Microsoft.AspNetCore.Hosting;


class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello World!");
        CreateWebHostBuilder(args).Build().Run();        
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
        return new WebHostBuilder().UseStartup<Launcher>();
    }
}

}
