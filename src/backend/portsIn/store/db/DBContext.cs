namespace SnippetVault {
using Microsoft.Extensions.Configuration;
using Npgsql;


public class DBContext : IDBContext {
    public NpgsqlConnection conn {get;}

    public DBContext(IConfiguration configuration) {
        this.conn = new NpgsqlConnection(configuration["DBConnectionString"]);
        this.conn.Open();
    }
}


public interface IDBContext {
    public NpgsqlConnection conn {get;}
}

}