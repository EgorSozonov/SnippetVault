#include "oatpp/web/server/HttpConnectionHandler.hpp"
#include "oatpp/network/Server.hpp"
#include "oatpp/network/tcp/server/ConnectionProvider.hpp"
#include <iostream>
#include <tao/pq.hpp>
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
    const auto conn = tao::pq::connection::create( "dbname=template1" );

    // execute statements
    conn->execute( "DROP TABLE IF EXISTS users" );
    conn->execute( "CREATE TABLE users ( name TEXT PRIMARY KEY, age INTEGER NOT NULL )" );

    // prepare statements
    conn->prepare( "insert_user", "INSERT INTO users ( name, age ) VALUES ( $1, $2 )" );

    {
       // begin transaction
       const auto tr = conn->transaction();

       // execute previously prepared statements
       tr->execute( "insert_user", "Daniel", 42 );
       tr->execute( "insert_user", "Tom", 41 );
       tr->execute( "insert_user", "Jerry", 29 );

       // commit transaction
       tr->commit();
    }

    // query data
    const auto users = conn->execute( "SELECT name, age FROM users WHERE age >= $1", 40 );

    // iterate and convert results
    for ( const auto& row : users ) {
       cout << row[ "name" ].as<string>() << " is "
            << row[ "age" ].as< unsigned >() << " years old.\n";
    }
}

void run() {
    /* Create Router for HTTP requests routing */
    auto router = oatpp::web::server::HttpRouter::createShared();
    /* Route GET - "/hello" requests to Handler */
    router->route("GET", "/hw", std::make_shared<Handler>());

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
