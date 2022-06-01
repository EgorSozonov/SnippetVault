package tech.sozonov.SnippetVault.user;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
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
    SELECT id AS "userId", encode(hash, 'base64') AS hash, encode(salt, 'base64') AS salt, expiration, "accessToken"
    FROM sv.user WHERE name = :name
""";
public Mono<AuthenticateIntern> userAuthentGet(String userName) {
    val deserializer = new Deserializer<>(AuthenticateIntern.class, userAuthentGetQ);
    return db.sql(userAuthentGetQ)
             .bind("name", userName)
             .map(deserializer::unpackRow)
             .one();
}

private static final String userAuthorizGetQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE id = :id
""";
public Mono<AuthorizeIntern> userAuthorizGet(int userId) {
    val deserializer = new Deserializer<>(AuthorizeIntern.class, userAuthorizGetQ);
    return db.sql(userAuthorizGetQ)
         .bind("id", userId)
         .map(deserializer::unpackRow)
         .one();
}


private static final String userAdminAuthorizQ = """
    SELECT "accessToken", expiration
    FROM sv.user WHERE name = :name
""";
public  Mono<AuthorizeIntern> userAdminAuthoriz() {
    val deserializer = new Deserializer<>(AuthorizeIntern.class, userAdminAuthorizQ);
    return db.sql(userAdminAuthorizQ)
             .bind("name", AdminPasswordChecker.adminName)
             .map(deserializer::unpackRow)
             .one();
}

private static final String userUpdateExpirationQ = """
    UPDATE sv."user" SET expiration=:newDate, "accessToken" = :newToken
    WHERE id = :id
""";
public Mono<Integer> userUpdateExpiration(int userId, String newToken, LocalDateTime newDate) {
    return db.sql(userUpdateExpirationQ)
             .bind("id", userId)
             .bind("newDate", newDate)
             .bind("newToken", newToken)
             .fetch()
             .rowsUpdated();
}

private static final String userRegisterQ = """
    INSERT INTO sv."user"(name, "dateJoined", expiration, "accessToken", hash, salt)
    VALUES (:name, :tsJoin, :dtExpiration, :accessToken,
            decode(:hash, 'base64'), decode(:salt, 'base64'))
    ON CONFLICT DO NOTHING RETURNING id
""";
public Mono<Integer> userRegister(UserNewIntern user) {
    return db.sql(userRegisterQ)
             .bind("name", user.userName)
             .bind("salt", user.salt)
             .bind("hash", user.hash)
             .bind("accessToken", user.accessToken)
             .bind("tsJoin", LocalDateTime.now())
             .bind("dtExpiration", user.dtExpiration)
             .fetch()
             .first()
             .map(r -> (int) r.get("id"));
}

private static final String userUpdateQ = """
    UPDATE sv.user SET hash = decode(:hash, 'base64'), salt = decode(:salt, 'base64'),
                       expiration = :dtExpiration, "accessToken" = :accessToken
    WHERE name = :name
""";
public Mono<Integer> userUpdate(UserNewIntern user) {
    return db.sql(userUpdateQ)
             .bind("name", user.userName)
             .bind("salt", user.salt)
             .bind("hash", user.hash)
             .bind("accessToken", user.accessToken)
             .bind("dtExpiration", user.dtExpiration)
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
    return db.sql(commentsGetQ)
             .bind("$1", snippetId)
             .map(deserializer::unpackRow)
             .all();
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
    return db.sql(userVoteQ)
             .bind("id", userId)
             .bind("tlId", tlId)
             .bind("snId", snId)
             .fetch()
             .rowsUpdated();
}

private static final String userProfileQ = """
    SELECT
    	SUM(CASE WHEN s.status IN (1, 3) THEN 1 ELSE 0 END) AS "proposalCount",
    	SUM(CASE WHEN s.status = 3 THEN 1 ELSE 0 END) AS "approvedCount",
    	SUM(CASE WHEN s.status = 3 AND tl.id IS NOT NULL THEN 1 ELSE 0 END) AS "primaryCount"
    FROM sv.snippet s
    LEFT JOIN sv."taskLanguage" tl ON tl."primarySnippetId" = s.id
    WHERE "authorId" = :userId
""";
public  Mono<Profile> userProfile(int userId) {
    val deserializer = new Deserializer<>(Profile.class, userProfileQ);
    return db.sql(userProfileQ)
             .bind("userId", userId)
             .map(deserializer::unpackRow)
             .one();
}

private static final String userDataQ = """
    SELECT name, "dateJoined" AS "tsJoined" FROM sv.user WHERE id = $1
""";
public Mono<User> userData(int userId) {
    val deserializer = new Deserializer<>(User.class, userDataQ);
    return db.sql(userDataQ)
             .bind("$1", userId)
             .map(deserializer::unpackRow)
             .one();
}

private static final String commentCreateQ = """
    INSERT INTO sv.comment("userId", "snippetId", content, "tsUpload")
    VALUES (:userId, :snId, :content, :ts)
""";
public Mono<Integer> commentCreate(int userId, int snId, String content, LocalDateTime ts) {
    return db.sql(commentCreateQ)
             .bind("userId", userId)
             .bind("content", content)
             .bind("snId", snId)
             .bind("ts", ts)
             .fetch()
             .rowsUpdated();
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


}
