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
        string lang1Str = context.Request.RouteValues["lang1"] as string;
        string lang2Str = context.Request.RouteValues["lang2"] as string;
        string tgStr = context.Request.RouteValues["taskGroup"] as string;
        if (!int.TryParse(lang1Str, out int lang1)) return;
        if (!int.TryParse(lang2Str, out int lang2)) return;
        if (!int.TryParse(tgStr, out int taskGroup)) return;

        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.snippet, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                await readResultSet<SnippetDTO>(reader, context.Response);
            }
        }
    }

    private static async Task language(HttpContext context, IDBContext dbContext) {
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.language, dbContext.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                 
                await readResultSet<LanguageDTO>(reader, context.Response);             
            }
        }
    }

    private static async Task taskGroup(HttpContext context, IDBContext dbContext) {
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.taskGroup, dbContext.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<TaskGroupDTO>(reader, context.Response);                               
            }
        }
    }    

    private static async Task proposal(HttpContext context, IDBContext dbContext) {
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.proposal, dbContext.conn)) { 
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<ProposalDTO>(reader, context.Response);                            
            }
        }
    }

    private static async Task task(HttpContext context, IDBContext dbContext) {
        string tgIdStr = context.Request.RouteValues["taskGroupId"] as string;
        if (!int.TryParse(tgIdStr, out int tgId)) return;
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.task, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, tgId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<TaskDTO>(reader, context.Response);                            
            }
        }
    }

    private static async Task taskGroupsForLanguage(HttpContext context, IDBContext dbContext) {
        string paramStr = context.Request.RouteValues["langId"] as string;
        if (!int.TryParse(paramStr, out int langId)) return;
        await taskGroupsForArrayLanguages(new int[] {langId}, context, dbContext);
    }

    private static async Task taskGroupsForLanguages(HttpContext context, IDBContext dbContext) {
        string paramStr1 = context.Request.RouteValues["langId1"] as string;
        string paramStr2 = context.Request.RouteValues["langId2"] as string;
        if (!int.TryParse(paramStr1, out int langId1)) return;
        if (!int.TryParse(paramStr2, out int langId2)) return;
        await taskGroupsForArrayLanguages(new int[] {langId1, langId2}, context, dbContext);
    }


    private static async Task taskGroupsForArrayLanguages(int[] langs, HttpContext context, IDBContext dbContext) {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.taskGroupsForLanguages, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("ls", NpgsqlTypes.NpgsqlDbType.Array|NpgsqlTypes.NpgsqlDbType.Integer, langs);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                await readResultSet<TaskGroupDTO>(reader, context.Response);
            }
        }
    }

    private static async Task alternative(HttpContext context, IDBContext dbContext) {
        string paramStr = context.Request.RouteValues["taskLanguageId"] as string;
        if (!int.TryParse(paramStr, out int taskLanguageId)) return;
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.task, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("tl", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<AlternativeDTO>(reader, context.Response);                            
            }
        }
    }

    private static async Task comment(HttpContext context, IDBContext dbContext) {
        string paramStr = context.Request.RouteValues["snippetId"] as string;
        if (!int.TryParse(paramStr, out int snippetId)) return;
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.task, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("sn", NpgsqlTypes.NpgsqlDbType.Integer, snippetId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {                                   
                await readResultSet<CommentDTO>(reader, context.Response);                            
            }
        }
    }

    private static async Task readResultSet<T>(NpgsqlDataReader reader, HttpResponse response) where T : class, new() {
        try {                    
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
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            await response.WriteAsync("Exception");
            return;
        }  
    }


    private static RequestDelegate addDBContext(Func<HttpContext, IDBContext, Task> f, IDBContext dBContext) {
        return x => f(x, dBContext);
    }


    private static void makeDelegates(IDBContext dbContext, out Tuple<RequestDelegate, string>[] delegatesForGetting, out RequestDelegate homePage) {
        delegatesForGetting = new Tuple<RequestDelegate, string>[] {
            new Tuple<RequestDelegate, string>(addDBContext(snippet, dbContext), "snippet/{lang1}/{lang2}/{taskGroup}"),
            new Tuple<RequestDelegate, string>(addDBContext(language, dbContext), "language"),
            new Tuple<RequestDelegate, string>(addDBContext(task, dbContext), "task/{taskGroupId}"),
            new Tuple<RequestDelegate, string>(addDBContext(taskGroupsForLanguage, dbContext), "taskGroupsForLanguage/{langId}"),
            new Tuple<RequestDelegate, string>(addDBContext(taskGroupsForLanguages, dbContext), "taskGroupsForLanguages/{langId1}/{langId2}"),
            new Tuple<RequestDelegate, string>(addDBContext(taskGroup, dbContext), "taskGroup"),
            new Tuple<RequestDelegate, string>(addDBContext(comment, dbContext), "comment/{snippetId}"),
            new Tuple<RequestDelegate, string>(addDBContext(alternative, dbContext), "alternative/{taskLanguageId}"),
            new Tuple<RequestDelegate, string>(addDBContext(proposal, dbContext), "proposal"),
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