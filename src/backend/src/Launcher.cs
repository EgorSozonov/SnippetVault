namespace SnippetVault{
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;


public class Launcher {
    public IConfiguration Configuration { get; }
    public Launcher(IConfiguration configuration)    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services) {
        Console.WriteLine("ConfigureServices");
        services.AddRouting();
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
            endpoints.MapGet("/", async context => {
                await context.Response.WriteAsync("Hello World!");
            });
        });
        //app.AddRouting();
    }
}   

}