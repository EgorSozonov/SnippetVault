namespace SnippetVault {
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
        services.AddScoped<AuthorizeFilter>();
        services.AddRouting();

        services.AddCors(o => o.AddPolicy("SVCorsPolicy", builder => {
            builder.WithOrigins(new string[] {"http://localhost:8080", "http://localhost:10200", "http://sozonov.tech", "https://sozonov.tech",
            "http://www.sozonov.tech", "https://www.sozonov.tech"})
                   .AllowAnyMethod()
                   .AllowCredentials()
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


        DefaultFilesOptions options = new DefaultFilesOptions();
        app.UseDefaultFiles(new DefaultFilesOptions());

        app.UseRouting();
        app.UseEndpoints(endpointRouteBuilder => {

            endpointRouteBuilder.MapControllers();
        });

        //app.UseMiddleware<AuthorizeMiddleware>();

    }
}

}
