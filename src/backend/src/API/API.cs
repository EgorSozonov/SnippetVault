namespace SnippetVault {
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Npgsql;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;


public static class API {
    private static async Task snippet(HttpContext context, IDBContext dbContext) {
        string lang1Str = context.Request.Query["lang1"][0];
        string lang2Str = context.Request.Query["lang2"][0];
        string tgStr = context.Request.Query["taskGroup"][0];
        if (!int.TryParse(lang1Str, out int lang1)) return;
        if (!int.TryParse(lang2Str, out int lang2)) return;
        if (!int.TryParse(tgStr, out int taskGroup)) return;

        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.snippet, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                //cmd.Prepare();
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<SnippetDTO>(columnNames);
                    if (!readerSnippet.isOK) {
                        await context.Response.WriteAsync("Error");
                        return;
                    }

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        await context.Response.WriteAsync(errMsg);
                        return;
                    }
                    await context.Response.WriteAsJsonAsync<List<SnippetDTO>>(results);
                    return;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    await context.Response.WriteAsync("Exception");
                    return;
                }
            }
        }
    }

    private static async Task language(HttpContext context, IDBContext dbContext) {
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.language, dbContext.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {                    
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<LanguageDTO>(columnNames);
                    if (!readerSnippet.isOK)  {
                        await context.Response.WriteAsync("Error");
                        return;
                    }

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        await context.Response.WriteAsync(errMsg);
                        return;
                    }
                    await context.Response.WriteAsJsonAsync<List<LanguageDTO>>(results);
                    return;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    await context.Response.WriteAsync("Exception");
                    return;
                }                
            }
        }
    }

    private static async Task taskGroup(HttpContext context, IDBContext dbContext) {
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.taskGroup, dbContext.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {                    
                    await readResultSet<TaskGroupDTO>(reader, context.Response);
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    await context.Response.WriteAsync("Exception");
                    return;
                }                
            }
        }
    }

    private static async Task readResultSet<T>(NpgsqlDataReader reader, HttpResponse response) where T : class, new() {
        string[] columnNames = new string[reader.FieldCount];
        for (int i = 0; i < reader.FieldCount; ++i) {
            columnNames[i] = reader.GetName(i);
        }
        var readerSnippet = new DBDeserializer<T>(columnNames);
        if (!readerSnippet.isOK)  {
            await response.WriteAsync("Error");
            return;
        }

        var results = readerSnippet.readResults(reader, out string errMsg);
        if (errMsg != "") {
            await response.WriteAsync(errMsg);
            return;
        }
        await response.WriteAsJsonAsync<List<T>>(results);
        return;
    }

    private static async Task proposal(HttpContext context, IDBContext dbContext) {
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.proposal, dbContext.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {                    
                    await readResultSet<ProposalDTO>(reader, context.Response);
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    await context.Response.WriteAsync("Exception");
                    return;
                }                
            }
        }
    }


    private static RequestDelegate addDBContext(Func<HttpContext, IDBContext, Task> f, IDBContext dBContext) {
        return x => f(x, dBContext);
    }


    private static void makeDelegates(IDBContext dbContext, out Tuple<RequestDelegate, string>[] delegatesForGetting, out RequestDelegate homePage) {
        delegatesForGetting = new Tuple<RequestDelegate, string>[] {
            new Tuple<RequestDelegate, string>(addDBContext(snippet, dbContext), nameof(snippet)),
            new Tuple<RequestDelegate, string>(addDBContext(language, dbContext), nameof(language)),
            new Tuple<RequestDelegate, string>(addDBContext(taskGroup, dbContext), nameof(taskGroup)),
        };
        homePage = context => {
            //IFileInfo file = null;
            return context.Response.WriteAsync("Index.html");
        };
    }


    public static void configure(IEndpointRouteBuilder builder, IDBContext dbContext) {
        makeDelegates(dbContext, out var delsForGetting, out var homePage);
        foreach (var del in delsForGetting) {
            builder.MapGet("/api/v1/get/" + del.Item2, del.Item1);
        }
        builder.MapGet("/", homePage);
    }
}

}