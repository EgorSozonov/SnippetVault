namespace SnippetVault {
using Microsoft.Extensions.Configuration;
using Npgsql;


public class DBContext : IDBContext {   
    public GetQueries getQueries {get;}
    public PostQueries postQueries {get;}
    public NpgsqlConnection conn {get;}

    public DBContext(IConfiguration configuration) {
        this.getQueries = GetPGQueries.mkGetQueries();
        this.postQueries = PostPGQueries.mkPostQueries();
        this.conn = new NpgsqlConnection(configuration["DBConnectionString"]);
        this.conn.Open();
    }
}


public interface IDBContext {
    public GetQueries getQueries {get;}
    public PostQueries postQueries {get;}
    public NpgsqlConnection conn {get;}
}

}