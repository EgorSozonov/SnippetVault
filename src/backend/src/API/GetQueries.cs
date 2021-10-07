namespace SnippetVault {
using System.Web.Http;


public partial class GetController  {
    public record GetQueries {
        public string snippet {get; init;}
        public string language {get; init;}
        public string languageGroup {get; init;}
    }

    public GetQueries mkGetQueries() {
        return new GetQueries() {snippet=@"sdg", language=@"sdfg", languageGroup="dfg"};
    }
}

}