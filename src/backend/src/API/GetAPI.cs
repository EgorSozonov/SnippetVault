namespace SnippetVault {
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;


[Controller]
[Route("sv/api/v1/get")]
public class GetController {    
    private readonly IDBContext dbContext;


    public GetController(IDBContext _dbContext) {
        dbContext = _dbContext;
    }


    [HttpGet]
    [Route("snippet/{lang1}/{lang2}/{taskGroup}")]
    async public Task<List<SnippetDTO>> snippet(int lang1, int lang2, int taskGroup) {        
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
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }

    [HttpGet]
    [Route("language")]
    async public Task<List<LanguageDTO>> language() {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.language, dbContext.conn)) { 
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<LanguageDTO>(columnNames);
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }

    [HttpGet]
    [Route("task")]
    async public Task<List<TaskDTO>> task(int taskGroupId) {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.task, dbContext.conn)) { 
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, taskGroupId);
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<TaskDTO>(columnNames);
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }

    [HttpGet]
    [Route("taskGroup")]
    async public Task<List<TaskGroupDTO>> taskGroup() {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.taskGroup, dbContext.conn)) { 
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<TaskGroupDTO>(columnNames);
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }

    [HttpGet]
    [Route("taskGroupsForLanguages/{lang1}")]
    async public Task<List<TaskGroupDTO>> taskGroupsForLanguage(int lang1) { 
        return await taskGroupsForArrayLanguages(new int[] {lang1});
    }

    [HttpGet]
    [Route("taskGroupsForLanguages/{lang1}/{lang2}")]
    async public Task<List<TaskGroupDTO>> taskGroupsForLanguages(int lang1, int lang2) {  
        return await taskGroupsForArrayLanguages(new int[] {lang1, lang2});

    }

    async private Task<List<TaskGroupDTO>> taskGroupsForArrayLanguages(int[] langs) {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.taskGroupsForLanguages, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("ls", NpgsqlTypes.NpgsqlDbType.Array|NpgsqlTypes.NpgsqlDbType.Integer, langs);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<TaskGroupDTO>(columnNames);
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }

    [HttpGet]
    [Route("proposal")]
    async public Task<List<ProposalDTO>> proposal() {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.proposal, dbContext.conn)) {             
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<ProposalDTO>(columnNames);
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }


    [HttpGet]
    [Route("alternative/{taskLanguageId}")]
    async public Task<List<AlternativeDTO>> alternative(int taskLanguageId) {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.alternative, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("tl", NpgsqlTypes.NpgsqlDbType.Integer, taskLanguageId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<AlternativeDTO>(columnNames);
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }


    [HttpGet]
    [Route("comment/{snippetId}")]
    async public Task<List<CommentDTO>> comment(int snippetId) {        
        await using (var cmd = new NpgsqlCommand(dbContext.getQueries.taskGroup, dbContext.conn)) { 
            cmd.Parameters.AddWithValue("sn", NpgsqlTypes.NpgsqlDbType.Integer, snippetId);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                try {
                    string[] columnNames = new string[reader.FieldCount];
                    for (int i = 0; i < reader.FieldCount; ++i) {
                        columnNames[i] = reader.GetName(i);
                    }
                    var readerSnippet = new DBDeserializer<CommentDTO>(columnNames);
                    if (!readerSnippet.isOK) return null;

                    var results = readerSnippet.readResults(reader, out string errMsg);
                    if (errMsg != "") {
                        Console.WriteLine(errMsg);
                        return null;
                    }
                    return results;
                } catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return null;
                }
            }
        }
    }


    [Route("/")]
    public string Default() {
        return "Default";
    }


    [HttpGet] 
    [Route("Bar/{id:int}")]
    public string Bar(int id) {
        return "Ba " + id;
    }
}
        //   NpgsqlCommand command = new NpgsqlCommand("SELECT COUNT(*) FROM cities", conn);
        //   Int64 count = (Int64)command.ExecuteScalar();
}