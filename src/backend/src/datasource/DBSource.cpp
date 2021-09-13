// #include "DBSource.hpp"
// #include "../utils/prelude/prelude.hpp"
// using namespace Prelude;



// vector<unique_ptr<SnippetDTO>> DBSource::unpackSnippets(tao::pq::result rSet) {
//     vector<unique_ptr<SnippetDTO>> result = {};
//     for (const auto& row : rSet) {
//         unique_ptr<SnippetDTO> newSnippet = make_unique<SnippetDTO>(row[0], row[1], row[2], row[3], row[4], row[5]);
//         result.push_back(newSnippet);
//     }
//     return result;
// }



// void getFromDB() {
//     // open a connection to the database
//     // "jdbc:postgresql://127.0.0.1:5432/bloglocal", "zrx", "asdf!22POIU"
    
//     const std::shared_ptr< tao::pq::connection_pool > connPool = tao::pq::connection_pool::create( "postgres://sv_user:asdf!querty@localhost:5432/bloglocal" );

//     // execute statements
// //    conn->execute( "DROP TABLE IF EXISTS users" );
// //    conn->execute( "CREATE TABLE users ( name TEXT PRIMARY KEY, age INTEGER NOT NULL )" );

//     // prepare statements
// //    conn->prepare( "insert_user", "INSERT INTO users ( name, age ) VALUES ( $1, $2 )" );
// //
// //    {
// //       // begin transaction
// //       const auto tr = conn->transaction();
// //
// //       // execute previously prepared statements
// //       tr->execute( "insert_user", "Daniel", 42 );
// //       tr->execute( "insert_user", "Tom", 41 );
// //       tr->execute( "insert_user", "Jerry", 29 );
// //
// //       // commit transaction
// //       tr->commit();
// //    }

//     // query data
//     const auto conn = connPool->connection();
//     const auto users = conn->execute( "SELECT sn1.id as \"leftId\", sn1.content as \"leftCode\",\
//                                      t.id AS \"taskId\", t.name AS \"taskName\",                \
//                                      sn2.id AS \"rightId\", sn2.content AS \"rightCode\"            \
//                               FROM snippet.\"task\" AS t \
//                               LEFT JOIN snippet.\"taskLanguage\" tl1 ON tl1.\"taskId\"=t.id AND tl1.\"languageId\"=0 \
//                               LEFT JOIN snippet.\"taskLanguage\" tl2 ON tl2.\"taskId\"=t.id AND tl2.\"languageId\"=11 \
//                               JOIN snippet.language l1 ON l1.id=tl1.\"languageId\" \
//                               JOIN snippet.language l2 ON l2.id=tl2.\"languageId\" \
//                               LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1.\"primarySnippetId\" \
//                               LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2.\"primarySnippetId\" \
//                               WHERE t.\"taskGroupId\"=$1;", 3 );
//     cout << "Users.size = " << users.size() << std::endl;
//     // iterate and convert results
//     for (const auto& row : users) {
//         cout << row.name(0) << " " << row.name(1) << endl;
//         cout << row[0].as<int>() << " is "
//             << row[1].as<string>() << endl;
//     }
// }
