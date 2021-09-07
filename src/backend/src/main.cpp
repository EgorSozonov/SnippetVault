#include "oatpp/web/server/HttpConnectionHandler.hpp"
#include "oatpp/network/Server.hpp"
#include "oatpp/network/tcp/server/ConnectionProvider.hpp"
#include <iostream>
#include <tao/pq.hpp>
#include <tao/pq/connection_pool.hpp>
#include "prelude/prelude.h"

using namespace Prelude;

/**
 * Custom Request Handler
 */
class Handler : public oatpp::web::server::HttpRequestHandler {
public:
    /**
    * Handle incoming request and return outgoing response.
    */
    std::shared_ptr<OutgoingResponse> handle(const std::shared_ptr<IncomingRequest>& request) override {
        return ResponseFactory::createResponse(Status::CODE_200, "Hello World!");
    }
};


void getFromDB() {
    // open a connection to the database
    // "jdbc:postgresql://127.0.0.1:5432/bloglocal", "zrx", "asdf!22POIU"
    
    const std::shared_ptr< tao::pq::connection_pool > connPool = tao::pq::connection_pool::create( "postgres://sv_user:asdf!querty@localhost:5432/bloglocal" );

    // execute statements
//    conn->execute( "DROP TABLE IF EXISTS users" );
//    conn->execute( "CREATE TABLE users ( name TEXT PRIMARY KEY, age INTEGER NOT NULL )" );

    // prepare statements
//    conn->prepare( "insert_user", "INSERT INTO users ( name, age ) VALUES ( $1, $2 )" );
//
//    {
//       // begin transaction
//       const auto tr = conn->transaction();
//
//       // execute previously prepared statements
//       tr->execute( "insert_user", "Daniel", 42 );
//       tr->execute( "insert_user", "Tom", 41 );
//       tr->execute( "insert_user", "Jerry", 29 );
//
//       // commit transaction
//       tr->commit();
//    }

    // query data
    const auto conn = connPool->connection();
    const auto users = conn->execute( "SELECT sn1.id as \"leftId\", sn1.content as \"leftCode\",\
                                     t.id AS \"taskId\", t.name AS \"taskName\",                \
                                     sn2.id AS \"rightId\", sn2.content AS \"rightCode\"            \
                              FROM snippet.\"task\" AS t \
                              LEFT JOIN snippet.\"taskLanguage\" tl1 ON tl1.\"taskId\"=t.id AND tl1.\"languageId\"=0 \
                              LEFT JOIN snippet.\"taskLanguage\" tl2 ON tl2.\"taskId\"=t.id AND tl2.\"languageId\"=11 \
                              JOIN snippet.language l1 ON l1.id=tl1.\"languageId\" \
                              JOIN snippet.language l2 ON l2.id=tl2.\"languageId\" \
                              LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1.\"primarySnippetId\" \
                              LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2.\"primarySnippetId\" \
                              WHERE t.\"taskGroupId\"=$1;", 3 );
    cout << "Users.size = " << users.size() << std::endl;
    // iterate and convert results
    for (const auto& row : users) {
        cout << row.name(0) << " " << row.name(1) << endl;
        cout << row[0].as<int>() << " is "
            << row[1].as<string>() << endl;
    }
}

void run() {
    /* Create Router for HTTP requests routing */
    auto router = oatpp::web::server::HttpRouter::createShared();
    /* Route GET - "/hello" requests to Handler */
    router->route("GET", "/hw", std::make_shared<Handler>());
    
    getFromDB();

    /* Create HTTP connection handler with router */
    auto connectionHandler = oatpp::web::server::HttpConnectionHandler::createShared(router);

    /* Create TCP connection provider */
    auto connectionProvider = oatpp::network::tcp::server::ConnectionProvider::createShared({"localhost", 47000, oatpp::network::Address::IP_4});

    /* Create server which takes provided TCP connections and passes them to HTTP connection handler */
    oatpp::network::Server server(connectionProvider, connectionHandler);

    /* Priny info about server port */
    OATPP_LOGI("MyApp", "Server running on port %s", connectionProvider->getProperty("port").getData());

    /* Run server */
    server.run();
}

int main() {
    /* Init oatpp Environment */
    oatpp::base::Environment::init();

    /* Run App */
    run();

    /* Destroy oatpp Environment */
    oatpp::base::Environment::destroy();

    return 0;

}
