namespace SnippetVault {
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


public static class HttpUtils {
    public async static Task sendResult<T>(ReqResult<T> result, HttpResponse response) {
        if (result is Err<T> err) {
            response.StatusCode = 500;
            await response.WriteAsync(err.err);
        } else if (result is Success<T> succ) {
            response.StatusCode = 200;
            await response.WriteAsJsonAsync(succ.vals);
        }
    }
}

}