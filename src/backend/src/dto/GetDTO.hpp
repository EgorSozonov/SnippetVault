#pragma once
#include "oatpp/core/Types.hpp"
#include "oatpp/core/macro/codegen.hpp"
using std::string;

#include OATPP_CODEGEN_BEGIN(DTO)

// class HelloDto : public oatpp::DTO {
  
//   DTO_INIT(HelloDto, DTO)
  
//   DTO_FIELD(String, userAgent, "user-agent");
//   DTO_FIELD(String, message);
//   DTO_FIELD(String, server);
  
// };

struct SnippetDTO : public oatpp::DTO {
    DTO_INIT(SnippetDTO, DTO);
    DTO_FIELD(Int64, leftId);
    DTO_FIELD(String, leftCode);
    DTO_FIELD(Int64, taskId);
    DTO_FIELD(String, taskName);
    DTO_FIELD(Int64, rightId);
    DTO_FIELD(String, rightCode);;
};


#include OATPP_CODEGEN_END(DTO)



struct TaskDTO {
    int id;
    string name;
};

struct TaskGroupDTO {
    int id;
    string name;
    string code;
};

struct ProposalDTO {
    int leftId;
    string leftCode;
    string taskName;
    string proposalCode;
    int langId;
    //date dateProposal;
};

struct LanguageDTO {
    int id;
    string name;
};
