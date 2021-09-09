#pragma once
#include <tao/pq/result.hpp>
#include "../dto/GetDTO.hpp"

class DBSource {
public:
    std::vector<SnippetDTO> unpackSnippets(tao::pq::result rSet);
};
