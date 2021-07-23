namespace Snippeteer {
    using System;
    using Microsoft.AspNetCore.Mvc;

    [Controller]
    [Route("ari")]
    public class AriController : Controller {
        public AriController() {

        }

        [HttpGet]
        [Route("hr")]
        public string hr() {
            return "Hello world!";
        }


    }


    [Controller]
    [Route("api/1.0")]
    public class ApiController : Controller {
        public ApiController() {

        }

        [HttpGet]
        [Route("hw")]
        public string hw() {
            return "Hello world!";
        }
    }


    [Controller]
    [Route("api/1.1")]
    public class ApiController11 : Controller {
        public ApiController11() {

        }

        [HttpGet]
        [Route("hw")]
        public string hw() {
            return "Hello world version 1.1!";
        }


    }
}
