namespace SnippetVault{
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;


public class Launcher {
    public IConfiguration configuration { get; }
    public Launcher(IConfiguration _configuration)    {
        configuration = _configuration;
    }

    public void ConfigureServices(IServiceCollection services) {
        services.Configure<WebConfig>(configuration);
        services.AddSingleton<IConfiguration>(configuration);
        services.AddSingleton<IDBContext, DBContext>();        
        services.AddRouting();
        services.AddControllers();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
        Console.WriteLine("Configure");
        if (env.IsDevelopment()) {
            app.UseDeveloperExceptionPage();
        } else {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        //app.UseHttpsRedirection();
        //app.UseStaticFiles();

        app.UseRouting();
        
        app.UseEndpoints(endpoints => {
            // endpoints.MapGet("/", async context => {
            //     await context.Response.WriteAsync("Hello World!");
            // });
            // endpoints.MapControllerRoute(
            //     name: "default",
            //     pattern: "sv/api/v1/{controller=Home}/{action=Index}");
            // endpoints.MapControllerRoute(
            //     name: "default2",
            //     pattern: "sv/api/v1/{controller=Home}/{action=Index}/{id}");
            endpoints.MapControllers();
        });

        //app.AddRouting();
    }
}   

}