namespace SnippetVault {


public class DBContext : IDBContext {   
    public GetQueries getQueries {get;}
    public PostQueries postQueries {get;}

    public DBContext() {
        this.getQueries = GetPGQueries.mkGetQueries();
        this.postQueries = PostPGQueries.mkPostQueries();
    }
}


public interface IDBContext {
    public GetQueries getQueries {get;}
    public PostQueries postQueries {get;}
}

}