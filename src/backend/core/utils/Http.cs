namespace SnippetVault {
    using System.Collections.Generic;
    using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


public static class HttpUtils {
    public async static Task sendQueryResult<T>(ReqResult<T> result, HttpResponse response) {
        await sendQueryResult(result, response, 500);
    }

    public async static Task sendQueryResult<T>(ReqResult<T> result, HttpResponse response, int responseCode) {
        if (result is Err<T> err) {
            response.StatusCode = responseCode;
            await response.WriteAsJsonAsync(new PostResponseDTO() { status = err.err});
        } else if (result is Success<T> succ) {
            response.StatusCode = 200;
            await response.WriteAsJsonAsync(succ.vals);
        }
    }

    public async static Task applyPostRequest(Task<int> postRequest, HttpResponse response) {
        var countRows = await postRequest;
        if (countRows > 0) {
            response.StatusCode = 200;
            await response.WriteAsJsonAsync(new PostResponseDTO() { status = "OK"});
        } else {
            response.StatusCode = 500;
            await response.WriteAsJsonAsync(new PostResponseDTO() { status = "Error"});     
        }
    }

    public static ReqResult<T> wrapSuccess<T>(T val) {
        return new Success<T>(new List<T>() {val});
    }
}

}