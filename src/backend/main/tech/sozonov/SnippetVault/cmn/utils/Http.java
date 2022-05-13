package tech.sozonov.SnippetVault.cmn.utils;

import org.springframework.http.ResponseEntity;

import reactor.core.publisher.Mono;

public class Http {

public static final Mono<ResponseEntity<Void>> BAD_REQUEST = Mono.just(ResponseEntity.badRequest().build());

/**
 * For a create-update request, wraps the result in a ResponseEntity depending on the number of DB rows affected.
 */
public static Mono<ResponseEntity<Void>> wrapCUResponse(Mono<Integer> inp) {
    return inp.map(x -> x > 0 ? ResponseEntity.ok().build() : ResponseEntity.internalServerError().build());
}
// public static Task sendQueryResult<T>(ReqResult<T> result, HttpResponse response) {
//     await sendQueryResult(result, response, 500);
// }

// public static Task sendQueryResult<T>(ReqResult<T> result, HttpResponse response, int responseCode) {
//     if (result is Err<T> err) {
//         response.StatusCode = responseCode;
//         await response.WriteAsJsonAsync(new PostResponseDTO() { status = err.err});
//     } else if (result is Success<T> succ) {
//         response.StatusCode = 200;
//         await response.WriteAsJsonAsync(succ.vals);
//     }
// }

// public static Task applyPostRequest(Task<int> postRequest, HttpResponse response) {
//     var countRows = await postRequest;
//     if (countRows > 0) {
//         response.StatusCode = 200;
//         await response.WriteAsJsonAsync(new PostResponseDTO() { status = "OK"});
//     } else {
//         response.StatusCode = 500;
//         await response.WriteAsJsonAsync(new PostResponseDTO() { status = "Error"});
//     }
// }

// public static ReqResult<T> wrapSuccess<T>(T val) {
//     return new Success<T>(new List<T>() {val});
// }

}
