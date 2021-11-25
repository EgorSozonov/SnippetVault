namespace SnippetVault {
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Npgsql;


public class DBStore : IStore {   
    private GetQueries getQueries {get;}
    private PostQueries postQueries {get;}
    private NpgsqlConnection conn {get;}
    private readonly IDBContext db;

    public DBStore(IDBContext _db) {
        this.db = _db;
    }

    public async Task<string> getSnippets(int taskGroup, int lang1, int lang2)    {
        await using (var cmd = new NpgsqlCommand(db.getQueries.snippet, db.conn)) { 
            cmd.Parameters.AddWithValue("l1", NpgsqlTypes.NpgsqlDbType.Integer, lang1);
            cmd.Parameters.AddWithValue("l2", NpgsqlTypes.NpgsqlDbType.Integer, lang2);
            cmd.Parameters.AddWithValue("tg", NpgsqlTypes.NpgsqlDbType.Integer, taskGroup);
            cmd.Prepare();
            await using (var reader = await cmd.ExecuteReaderAsync()) {
                return readResultSet<SnippetDTO>(reader);
            }
        }
    }

    private static string readResultSet<T>(NpgsqlDataReader reader) where T : class, new() {
        try {                    
            string[] columnNames = new string[reader.FieldCount];
            for (int i = 0; i < reader.FieldCount; ++i) {
                columnNames[i] = reader.GetName(i);
            }
            var readerSnippet = new DBDeserializer<T>(columnNames);
            if (!readerSnippet.isOK)  {
                return "Error";
            }

            var results = readerSnippet.readResults(reader, out string errMsg);
            if (errMsg != "") return errMsg;
            return JSON.encode<List<T>>(results);           
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            return "Exception";
        }  
    }
}



}