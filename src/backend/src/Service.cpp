// #include "Service.hpp"
// #include "utils/prelude/prelude.hpp"
// using namespace Prelude;


// void Service::fetchSnippets(int taskId, int lang1Id, int lang2Id, shared_ptr<tao::pq::connection> conn) {
//     const auto snippets = conn->execute( "SELECT sn1.id as \"leftId\", sn1.content as \"leftCode\",\
//                                      t.id AS \"taskId\", t.name AS \"taskName\",                \
//                                      sn2.id AS \"rightId\", sn2.content AS \"rightCode\"            \
//                               FROM snippet.\"task\" AS t \
//                               LEFT JOIN snippet.\"taskLanguage\" tl1 ON tl1.\"taskId\"=t.id AND tl1.\"languageId\"=$1 \
//                               LEFT JOIN snippet.\"taskLanguage\" tl2 ON tl2.\"taskId\"=t.id AND tl2.\"languageId\"=$2 \
//                               JOIN snippet.language l1 ON l1.id=tl1.\"languageId\" \
//                               JOIN snippet.language l2 ON l2.id=tl2.\"languageId\" \
//                               LEFT JOIN snippet.snippet sn1 ON sn1.id=tl1.\"primarySnippetId\" \
//                               LEFT JOIN snippet.snippet sn2 ON sn2.id=tl2.\"primarySnippetId\" \
//                               WHERE t.\"taskGroupId\"=$3;", lang1Id, lang2Id, taskId );
//     cout << "snippets.size = " << snippets.size() << endl;
//     // iterate and convert results
//     for (const auto& row : snippets) {
//         cout << row.name(0) << " " << row.name(1) << endl;
//         cout << row[0].as<int>() << " is "
//             << row[1].as<string>() << endl;
//     }
// }
