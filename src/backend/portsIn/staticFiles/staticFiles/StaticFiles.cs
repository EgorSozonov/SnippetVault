namespace SnippetVault {


public class StaticFiles : IStaticFiles
{
    public string indexHtmlGet() {
        return System.IO.File.ReadAllText("target/StaticFiles/index.html");
    }
}

}