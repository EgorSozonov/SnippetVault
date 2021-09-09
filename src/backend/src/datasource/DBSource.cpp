#include "DBSource.hpp"
#include "../prelude/prelude.h"
using namespace Prelude;



vector<unique_ptr<SnippetDTO>> DBSource::unpackSnippets(tao::pq::result rSet) {
    vector<unique_ptr<SnippetDTO>> result = {};
    for (const auto& row : rSet) {
        unique_ptr<SnippetDTO> newSnippet = make_unique<SnippetDTO>(row[0], row[1], row[2], row[3], row[4], row[5]);
        result.push_back(newSnippet);
    }
    return result;
}
