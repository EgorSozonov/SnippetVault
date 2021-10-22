namespace SnippetVault {
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;

[Controller]
public class RootController : Controller {    
   

    public RootController() {
    }

    [HttpGet]
    [Route("/")]
    public IActionResult defaultt() {
        return File("~/", "text/html", "index.html");
    }
}
}