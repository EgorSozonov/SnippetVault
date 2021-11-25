namespace SnippetVault {
using System.Threading.Tasks;

public interface IStore {
    Task<string> getSnippets(int taskGroupId, int lang1Id, int lang2Id);
}

}