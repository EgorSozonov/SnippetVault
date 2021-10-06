namespace SnippetVault {
using System;
using Microsoft.AspNetCore.Hosting;


class Program {
    static void Main(string[] args) {
        CreateWebHostBuilder(args).UseUrls("http://localhost:47000/").UseKestrel().Build().Run();        
        Console.WriteLine("Hello World...");
        
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
        Console.WriteLine("WebHostBuilder");
        return new WebHostBuilder().UseStartup<Launcher>();
    }
}

}
