namespace SnippetVault{
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.IO;


public class WebApp {
    public IConfiguration configuration { get; }
    public IDBContext dbContext { get; }


    public WebApp(IConfiguration _configuration, IDBContext _db)    {
        configuration = _configuration;
        dbContext = _db;
    }

    public void ConfigureServices(IServiceCollection services) {
        services.Configure<WebConfig>(this.configuration);
        services.AddSingleton<IConfiguration>(this.configuration);

        services.AddControllers();
        services.AddRouting();
        services.AddCors(o => o.AddPolicy("SVCorsPolicy", builder => {
            builder.WithOrigins("http://localhost:47001")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        }));
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env){
        if (env.IsDevelopment()) {
            app.UseDeveloperExceptionPage();
        } else {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }        

        app.UseCors("SVCorsPolicy");

        //app.UseHttpsRedirection();
        DefaultFilesOptions options = new DefaultFilesOptions();
        //options.DefaultFileNames.Clear();
        //options.DefaultFileNames.Add("index.html");
        app.UseDefaultFiles(new DefaultFilesOptions());
        app.UseStaticFiles(new StaticFileOptions {
            FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "StaticFiles"))
        });
        app.UseRouting();

        app.UseEndpoints(x => {
            x.MapControllers();
        });

        //    endpoints => {
        //     endpoints.MapGet("/", async context => {
        //         await context.Response.WriteAsync("Hello World!");
        //     });
        //     endpoints.MapGet("/api/v1/get/snippet", async context => {
                
        //     });
            // endpoints.MapControllerRoute(
            //     name: "default",
            //     pattern: "sv/api/v1/{controller=Home}/{action=Index}");
            // endpoints.MapControllerRoute(
            //     name: "default2",
            //     pattern: "sv/api/v1/{controller=Home}/{action=Index}/{id}");
        //     endpoints.MapControllers();
        // }
        // );

        //app.AddRouting();
    }
}   

}