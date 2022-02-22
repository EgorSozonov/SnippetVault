namespace SnippetVault {
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


public class LogService : ILogService {
    private readonly IStore st;

    public LogService(IStore _st) {
        this.st = _st;
    }

    public async Task<bool> error(string code, string message) {
        var i = await st.logMessage(DateTime.Now, 1, code, message);
        return i > 0;
    }

    private string makeAccessToken() {
        var uuid1 = Guid.NewGuid().ToString();
        var uuid2 = Guid.NewGuid().ToString();
        return (uuid1 + uuid2);
    }

}

public interface ILogService {
    Task<bool> error(string code, string message);
}

}
