package tech.sozonov.SnippetVault.user;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import lombok.val;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.*;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;
import tech.sozonov.SnippetVault.user.UserDTO.*;

public class UserStore implements IUserStore {


// CND806675Q
// 15-bs654ur
private Connection conn;

@Autowired
public UserStore(Connection _conn) {
    conn = _conn;
}

private static final String userAuthentGetQ = """
    SELECT id AS "userId", encode(hash, 'base64') AS hash, encode(salt, 'base64') AS salt, expiration, "accessToken"
    FROM sv.user WHERE name = :name;
""";
public  Mono<AuthenticateIntern> userAuthentGet(String userName) {
    val deserializer = new Deserializer<AuthenticateIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userAuthentGetQ)
                            .bind("name", userName)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String userAuthorizGetQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE id = :id;
""";
public Mono<AuthorizeIntern> userAuthorizGet(int userId) {
    val deserializer = new Deserializer<AuthorizeIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userAuthorizGetQ)
                            .bind("id", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}


private static final String userAdminAuthorizQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE name = :name;
""";
public  Mono<AuthorizeIntern> userAdminAuthoriz() {
    val deserializer = new Deserializer<AuthorizeIntern>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userAdminAuthorizQ)
                            .bind("name", AdminPasswordChecker.adminName)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String userUpdateExpirationQ = """
    UPDATE sv."user" SET expiration=:newDate, "accessToken" = :newToken
    WHERE id = :id;
""";
public Mono<Integer> userUpdateExpiration(int userId, String newToken, LocalDateTime newDate) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userUpdateExpirationQ)
                            .bind("id", userId)
                            .bind("newDate", newDate)
                            .bind("newToken", newToken)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String userRegisterQ = """
    INSERT INTO sv."user"(name, "dateJoined", expiration, "accessToken", hash, salt)
    VALUES (:name, :tsJoin, :dtExpiration, :accessToken,
            decode(:hash, 'base64'), decode(:salt, 'base64'))
    ON CONFLICT DO NOTHING RETURNING id;
""";
public Mono<Integer> userRegister(UserNewIntern user) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userRegisterQ)
                            .bind("name", user.userName)
                            .bind("salt", user.salt)
                            .bind("hash", user.hash)
                            .bind("accessToken", user.accessToken)
                            .bind("tsJoin", LocalDateTime.now())
                            .bind("dtExpiration", user.dtExpiration)
                            .returnGeneratedValues("id")
                            .execute())
    	)
        .flatMap(result -> result != null ? result : 0);
}

private static final String userUpdateQ = """
    UPDATE sv.user SET hash = decode(:hash, 'base64'), salt = decode(:salt, 'base64'),
                       expiration = :dtExpiration, "accessToken" = :accessToken
    WHERE name = :name;
""";
public Mono<Integer> userUpdate(UserNewIntern user) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userUpdateQ)
                            .bind("name", user.userName)
                            .bind("salt", user.salt)
                            .bind("hash", user.hash)
                            .bind("accessToken", user.accessToken)
                            .bind("dtExpiration", user.dtExpiration)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());

}

private static final String commentsGetQ = """
    SELECT c.content, c."tsUpload", c.id, u.name AS author
	FROM sv.comment c
	JOIN sv.user u ON u.id=c."userId"
	WHERE c."snippetId" = :snId;
""";
public Flux<Comment> commentsGet(int snippetId) {
    val deserializer = new Deserializer<Comment>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(commentsGetQ)
                            .bind("snId", snippetId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String userVoteQ = """
    BEGIN;
    WITH existingVote AS (
        SELECT uv."snippetId" FROM sv."userVote" uv
        WHERE uv."userId"=:userId AND uv."taskLanguageId"=:tlId LIMIT 1
    )
    UPDATE sv.snippet SET score=score-1 WHERE id IN (SELECT "snippetId" FROM existingVote);

    INSERT INTO sv."userVote"("userId", "taskLanguageId", "snippetId")
    VALUES (:userId, :tlId, :snId)
    ON CONFLICT("userId", "taskLanguageId")
    DO UPDATE SET "snippetId"=EXCLUDED."snippetId";

    UPDATE sv.snippet
    SET score=score + 1 WHERE id=:snId;

    COMMIT;
""";
public Mono<Integer> userVote(int userId, int tlId, int snId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userVoteQ)
                            .bind("id", userId)
                            .bind("tlId", tlId)
                            .bind("snId", snId)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String userProfileQ = """
    SELECT
    	SUM(CASE WHEN s.status IN (1, 3) THEN 1 ELSE 0 END) AS "proposalCount",
    	SUM(CASE WHEN s.status = 3 THEN 1 ELSE 0 END) AS "approvedCount",
    	SUM(CASE WHEN s.status = 3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS "primaryCount"
    FROM sv.snippet s
    LEFT JOIN sv."taskLanguage" tl ON tl."primarySnippetId" = s.id
    WHERE "authorId" = :userId;
""";
public  Mono<Profile> userProfile(int userId) {
    val deserializer = new Deserializer<Profile>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userProfileQ)
                            .bind("userId", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String userDataQ = """
    SELECT name, "dateJoined" AS "tsJoined" FROM sv.user WHERE id = :userId;
""";
public  Mono<User> userData(int userId) {
    val deserializer = new Deserializer<User>();
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(userDataQ)
                            .bind("userId", userId)
                            .execute())
    	)
        .flatMap(result -> result.map((row, rowMetadata) -> deserializer.read(row)));
}

private static final String commentCreateQ = """
    INSERT INTO sv.comment("userId", "snippetId", content, "tsUpload")
    VALUES (:userId, :snId, :content, :ts);
""";
public Mono<Integer> commentCreate(int userId, int snId, String content, LocalDateTime ts) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(commentCreateQ)
                            .bind("userId", userId)
                            .bind("content", content)
                            .bind("snId", snId)
                            .bind("ts", ts)
                            .execute())
    	)
        .flatMap(result -> result.getRowsUpdated());
}

private static final String commentDeleteQ = """
    DELETE FROM sv.comment WHERE id=:commentId;
""";
public Mono<Integer> commentDelete(int commentId) {
    Mono.from(conn)
        .flatMap(
            c -> Mono.from(c.createStatement(commentDeleteQ)
                            .bind("commentId", commentId)
    	                  )
                    .flatMap(result -> result.getRowsUpdated())
        );
}




}
