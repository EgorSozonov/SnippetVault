#pragma once
#include "Service.hpp"
#include "oatpp/web/server/api/ApiController.hpp"
#include "oatpp/parser/json/mapping/ObjectMapper.hpp"
#include "oatpp/core/macro/codegen.hpp"
#include "dto/GetDTO.hpp"
using oatpp::web::server::api::ApiController;
using std::shared_ptr;

#include OATPP_CODEGEN_BEGIN(ApiController) //<- Begin Codegen

/**
 * User REST controller.
 */
class SnippetController : public ApiController {
    public:
    SnippetController( OATPP_COMPONENT(shared_ptr<ObjectMapper>, objMapper) ) : ApiController(objMapper) {

    }

    ENDPOINT("GET", "/api/snippet/{taskId}/{langId1}/{langId2}", getSnippets, 
        PATH(Int64, taskId), PATH(Int64, langId1, "langId1"), PATH(Int64, langId2, "langId2")) {
        // OATPP_LOGD("Test", "taskId=%d", taskId->getValue());
        // OATPP_LOGD("Test", "lang1Id=%d", langId1->getValue());
        // OATPP_LOGD("Test", "lang2Id=%d", langId2->getValue());
        
        //auto x = HelloDto::createShared();
        auto dto = SnippetDTO::createShared();
        dto->taskId = taskId;
        dto->leftCode = "left code";
        dto->leftId = langId1;
        dto->taskName = " task name";
        dto->rightId = langId2;
        dto->rightCode = " right code";
        return createDtoResponse(Status::CODE_200, dto);
        //return createResponse(Status::CODE_200, "OK");
    }
};

#include OATPP_CODEGEN_END(ApiController) //<- End Codegen


