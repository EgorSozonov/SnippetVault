#pragma once


struct SnippetDTO {
    int leftId;
    string leftCode;
    int taskId;
    string taskName;
    int rightId;
    string rightCode;
};


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
    date dateProposal;
};

struct LanguageDTO {
    int id;
    string name;
};
