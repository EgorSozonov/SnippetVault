namespace SnippetVault {
using System;
using Microsoft.Extensions.Configuration;
using Npgsql;


public class DBContext : IDBContext, IDisposable {
    public NpgsqlConnection conn {get;}

    public DBContext(IConfiguration configuration) {
        this.conn = new NpgsqlConnection(configuration["DBConnectionString"]);
        this.conn.Open();
    }

    public void Dispose() {
        this.conn.Close();
    }
}

public interface IDBContext {
    public NpgsqlConnection conn {get;}
}

}