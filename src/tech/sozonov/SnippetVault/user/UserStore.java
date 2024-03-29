package tech.sozonov.SnippetVault.user;
import static tech.sozonov.SnippetVault.cmn.utils.DB.*;

import java.time.LocalDateTime;
import java.util.function.BiFunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.DatabaseClient.GenericExecuteSpec;
import org.springframework.stereotype.Component;
import lombok.val;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.sozonov.SnippetVault.cmn.internal.InternalTypes.*;
import tech.sozonov.SnippetVault.cmn.utils.Deserializer;
import tech.sozonov.SnippetVault.user.UserDTO.*;
import tech.sozonov.SnippetVault.user.auth.AdminPasswordChecker;

@Component
public class UserStore implements IUserStore {


private DatabaseClient db;

@Autowired
public UserStore(DatabaseClient _db) {
    db = _db;
}

private static final String userAuthentGetQ = """
    SELECT id AS "userId", salt, verifier, b, expiration, "accessToken"
    FROM sv.user WHERE name = :name
""";
public Mono<AuthenticateIntern> userAuthentGet(String userName) {
    val deserializer = new Deserializer<>(AuthenticateIntern.class, userAuthentGetQ);
    return db.sql(deserializer.sqlSelectQuery)
             .bind("name", userName)
             .map(deserializer::unpackRow)
             .one();
}

private static final String userAuthorizGetQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE name = :userName
""";
public Mono<AuthorizeIntern> userAuthorizGet(String userName) {
    val deserializer = new Deserializer<>(AuthorizeIntern.class, userAuthorizGetQ);
    return db.sql(deserializer.sqlSelectQuery)
         .bind("userName", userName)
         .map(deserializer::unpackRow)
         .one();
}


private static final String userAdminAuthorizQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE name = :name
""";
public  Mono<AuthorizeIntern> userAdminAuthoriz() {
    val deserializer = new Deserializer<>(AuthorizeIntern.class, userAdminAuthorizQ);
    return db.sql(deserializer.sqlSelectQuery)
             .bind("name", AdminPasswordChecker.adminName)
             .map(deserializer::unpackRow)
             .one();
}

private static final String userRegisterQ = """
    INSERT INTO sv."user"(name, "dateJoined", expiration, "accessToken", salt, verifier, b)
    VALUES (:name, :tsJoin, :dtExpiration, 'f',
            :salt, :verifier, :b)
    ON CONFLICT DO NOTHING RETURNING id
""";
public Mono<Integer> userRegister(UserNewIntern user) {
    return db.sql(userRegisterQ)
             .bind("name", user.userName)
             .bind("tsJoin", LocalDateTime.now())
             .bind("dtExpiration", user.dtExpiration)
             .bind("salt", user.salt)
             .bind("verifier", user.verifier)
             .bind("b", user.b)
             .fetch()
             .first()
             .map(r -> (int) r.get("id"));
}

private static final String userHandshakeQ = """
    UPDATE sv.user SET b = :b
    WHERE name = :name
""";
public Mono<Integer> userHandshake(Handshake hshake, byte[] b) {
    return db.sql(userHandshakeQ)
             .bind("name", hshake.userName)
             .bind("b", b)
             .fetch()
             .rowsUpdated();
}

private static final String userHandshakeGetQ = """
    SELECT id AS "userId", salt, verifier
    FROM sv.user WHERE name = :name
""";
public Mono<HandshakeIntern> userHandshakeGet(String userName) {
    val deserializer = new Deserializer<>(HandshakeIntern.class, userHandshakeGetQ);
    return db.sql(deserializer.sqlSelectQuery)
             .bind("name", userName)
             .map(deserializer::unpackRow)
             .one();
}

private static final String userSignInQ = """
    UPDATE sv.user SET expiration = :dtExpiration, "accessToken" = :accessToken, b = :b
    WHERE id = :userId
""";
public Mono<Integer> userSignIn(UserSignInIntern user) {
    return db.sql(userSignInQ)
             .bind("userId", user.userId)
             .bind("dtExpiration", user.dtExpiration)
             .bind("b", user.b)
             .bind("accessToken", user.accessToken)
             .bind("userId", user.userId)
             .fetch()
             .rowsUpdated();
}


private static final String userUpdatePwQ = """
    UPDATE sv.user SET expiration = :dtExpiration, "accessToken" = :accessToken, verifier = :verifier, salt = :salt
    WHERE name = :userName
""";
public Mono<Integer> userUpdatePw(UserUpdatePwIntern user) {
    return db.sql(userUpdatePwQ)
             .bind("dtExpiration", user.dtExpiration)
             .bind("verifier", user.verifier)
             .bind("salt", user.salt)
             .bind("accessToken", user.accessToken)
             .bind("userName", user.userName)
             .fetch()
             .rowsUpdated();
}

private static final String commentsGetQ = """
    SELECT c.content, c."tsUpload", c.id, u.name AS author
	FROM sv.comment c
	JOIN sv.user u ON u.id=c."userId"
	WHERE c."snippetId" = $1
""";
public Flux<Comment> commentsGet(int snippetId) {
    val deserializer = new Deserializer<>(Comment.class, commentsGetQ);
    return db.sql(deserializer.sqlSelectQuery)
             .bind("$1", snippetId)
             .map(deserializer::unpackRow)
             .all();
}

private static final String userVotePrelimQ = """
    SELECT id FROM sv.user WHERE name = $1
""";
private static final String userVoteQ = """
    BEGIN;
    WITH existingVote AS (
        SELECT uv."snippetId"
        FROM sv."userVote" uv
        WHERE uv."userId"=:authorId AND uv."taskLanguageId"=:tlId LIMIT 1
    )
    UPDATE sv.snippet SET score = score - 1 WHERE id IN (SELECT "snippetId" FROM existingVote);

    INSERT INTO sv."userVote"("userId", "taskLanguageId", "snippetId")
    VALUES (:authorId, :tlId, :snId)
    ON CONFLICT("userId", "taskLanguageId")
    DO UPDATE SET "snippetId" = EXCLUDED."snippetId";

    UPDATE sv.snippet
    SET score=score + 1 WHERE id = :snId;

    COMMIT;
""";
public Mono<Integer> userVote(String userName, int tlId, int snId) {
    return db.sql(userVotePrelimQ)
             .bind("$1", userName)
             .fetch()
             .first()
             .map(r -> (int) r.get("id"))
             .flatMap(userId -> {
                // We have to do this because the R2DBC driver for PostgresQL insists on making prepared statements,
                // and Postgres doesn't support prepared statements with multiple SQL commands and bindings at the same time.
                // Ideally I'd want an unprepared statement, but the library doesn't support that.
                // We are safe against SQL injection, though, since the params are all numeric.
                String sqlSubstituted = userVoteQ.replaceAll(":authorId", userId.toString())
                                                 .replaceAll(":tlId", Integer.toString(tlId))
                                                 .replaceAll(":snId", Integer.toString(snId));
                return db.sql(sqlSubstituted)
                         .fetch()
                         .rowsUpdated();
             });

}

private static final String userProfileQ = """
    SELECT
    	SUM(CASE WHEN s.status IN (1, 3) THEN 1 ELSE 0 END) AS "proposalCount",
    	SUM(CASE WHEN s.status = 3 THEN 1 ELSE 0 END) AS "approvedCount",
    	SUM(CASE WHEN s.status = 3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS "primaryCount",
        (SELECT "dateJoined" FROM sv.user WHERE id=24 LIMIT 1) AS "tsJoined"
    FROM sv.snippet s
    JOIN sv.user u ON u.id=s."authorId"
    LEFT JOIN sv."taskLanguage" tl ON tl."primarySnippetId" = s.id
    WHERE u.name=:userName
""";
public  Mono<Profile> userProfile(String userName) {
    val deserializer = new Deserializer<>(Profile.class, userProfileQ);
    return db.sql(deserializer.sqlSelectQuery)
             .bind("userName", userName)
             .map(deserializer::unpackRow)
             .one();
}

private static final String userDataQ = """
    SELECT name, "dateJoined" AS "tsJoined" FROM sv.user WHERE name = $1
""";
public Mono<User> userData(String userName) {
    val deserializer = new Deserializer<>(User.class, userDataQ);
    return db.sql(deserializer.sqlSelectQuery)
             .bind("$1", userName)
             .map(deserializer::unpackRow)
             .one();
}

private static final String commentCreateQ = """
    INSERT INTO sv.comment("userId", "snippetId", content, "tsUpload", "isDeleted")
    VALUES ((SELECT id FROM sv.user WHERE name=:userName LIMIT 1), :snId, :content, :ts, false)
""";
private static final String commentUpdateQ = """
    UPDATE sv.comment SET "userId" = (SELECT id FROM sv.user WHERE name=:userName LIMIT 1),
                          "snippetId" = :snId, content = :content, "tsUpload" = :ts, "isDeleted" = :isDeleted
    WHERE id = :existingId
""";
public Mono<Integer> commentCU(CommentCU dto, String userName, LocalDateTime ts) {
    BiFunction<GenericExecuteSpec, CommentCU, GenericExecuteSpec> binder =
        (cmd, x) -> cmd.bind("userName", userName)
                       .bind("content", dto.content)
                       .bind("snId", dto.snId)
                       .bind("ts", ts);
    return createOrUpdate(commentCreateQ, commentUpdateQ, binder, dto, db);
}

private static final String commentDeleteQ = """
    DELETE FROM sv.comment WHERE id = $1
""";
public Mono<Integer> commentDelete(int commentId) {
    return db.sql(commentDeleteQ)
             .bind("$1", commentId)
             .fetch()
             .rowsUpdated();
}

private static final String userCountQ = """
SELECT
    COUNT(id) AS cnt
FROM sv.user u
""";
public Mono<Long> userCount() {
    return db.sql(userCountQ)
            .fetch()
            .first()
            .map(r -> (long) r.get("cnt"));
}


public Mono<Integer> initPopulate(String sqlScript) {
    return db.sql(sqlScript)
            .fetch().rowsUpdated();
}

}
