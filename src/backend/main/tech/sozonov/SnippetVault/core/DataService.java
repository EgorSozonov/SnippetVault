package tech.sozonov.SnippetVault.core;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.core.DTO.AuxDTO.TaskCU;
import tech.sozonov.SnippetVault.core.utils.Types.ReqResult;
import tech.sozonov.SnippetVault.portsIn.IStore;


@Component
public class DataService {
private final IStore st;

@Autowired
public DataService(IStore _st) {
    this.st = _st;
}

public Mono<ServerResponse> foo(ServerRequest req) {
    return ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON)
        .body(Mono.just("Hello, Spring!"), String.class);
}

public Mono<ReqResult<TaskCU>> tasksAll() {
}
    // public async Task<ReqResult<TaskCUDTO>> tasksAll() {
    //     var res = await st.tasksAll();

    //     if (res is Success<TaskCUIntern> succ) {
    //         return new Success<TaskCUDTO>(succ.vals.Select(x => new TaskCUDTO() {
    //             name = x.name,
    //             description = x.description,
    //             taskGroup = new SelectChoice() {id = x.taskGroupId, name = x.taskGroupName},
    //             existingId = x.existingId,
    //             isDeleted = x.isDeleted,
    //         })
    //         .ToList());
    //     } else {
    //         return new Err<TaskCUDTO>("Error");
    //     }

    // }



	// public Mono<ServerResponse> addCricketer(ServerRequest serverRequest) {
	// 	Mono<Cricketer> cricketerWrapper = serverRequest.bodyToMono(Cricketer.class);
	// 	return cricketerWrapper.flatMap(
	// 			cricketer ->
	// 					ServerResponse.ok().contentType(MediaType.APPLICATION_JSON)
	// 							.body(cricketerRepository.save(cricketer), Cricketer.class)
	// 	);

	// }

	// public Mono<ServerResponse> updateCricketer(ServerRequest serverRequest) {
	// 	String id = serverRequest.pathVariable("id");
	// 	Mono<Cricketer> cricketerRequest = serverRequest.bodyToMono(Cricketer.class);
	// 	Mono<Cricketer> cricketerMono = cricketerRepository.findById(id);
	// 	Mono<Cricketer> updatedCricketer = cricketerRequest.flatMap(cricketer -> {
	// 		cricketerMono.flatMap(currentCricketer -> {
	// 			currentCricketer.setCountry(cricketer.getCountry());
	// 			currentCricketer.setName(cricketer.getName());
	// 			currentCricketer.setHighestScore(cricketer.getHighestScore());
	// 			return cricketerRepository.save(currentCricketer);
	// 		});
	// 		return cricketerMono;
	// 	});
	// 	return updatedCricketer.flatMap(cricketer ->
	// 			ServerResponse.ok().contentType(MediaType.APPLICATION_JSON)
	// 					.body(fromObject(cricketer))
	// 	).switchIfEmpty(notFound);
	// }

	// public Mono<ServerResponse> deleteCricketer(ServerRequest serverRequest) {
	// 	String id = serverRequest.pathVariable("id");
	// 	Mono<Void> deleteCricketer = cricketerRepository.deleteById(id);
	// 	return ServerResponse.ok().contentType(MediaType.APPLICATION_JSON)
	// 			.body(deleteCricketer, Void.class);
	// }

	// public Mono<ServerResponse> exceptionExample(ServerRequest serverRequest) {
	// 	throw new RuntimeException("RuntimeException occurred");
	// }
}
