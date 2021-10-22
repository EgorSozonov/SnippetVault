namespace SnippetVault {
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;


[Controller]
[Route("sv/api/v1/post")]
public class PostController {    
    private readonly IDBContext dbContext;

    public PostController(IDBContext _dbContext) {
        dbContext = _dbContext;
    }



}

}