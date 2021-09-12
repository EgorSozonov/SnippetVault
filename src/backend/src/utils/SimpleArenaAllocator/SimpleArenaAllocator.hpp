#pragma once
#include <string>
#include <iostream>
#include <forward_list>
#define VERBOSE true


class SimpleArenaAllocator final {
    
public:
    template <typename T, typename... Args>
    auto alloc(Args &&... args) noexcept -> T* {
#ifdef VERBOSE
        std::cout << "In alloc" << std::endl;
#endif
        int valueSize = sizeof(T);
        if (valueSize > slabSize - currentInd) {
            this->addSlab();
        }
        if (valueSize > slabSize - currentInd) return nullptr;
        auto result = reinterpret_cast<T *>(this->currentSlab + this->currentInd);
        new (result) T(std::forward<Args>(args)...);
        currentInd += valueSize;
#ifdef VERBOSE
        std::cout << "Alloc was successful" << std::endl;
#endif
        return result;
    }
    
    auto terminate() noexcept -> void;
    explicit SimpleArenaAllocator(int);
    ~SimpleArenaAllocator();
    
private:
    std::forward_list<std::unique_ptr<unsigned char[]>> slabs;
    int slabSize;
    int currentInd;
    unsigned char* currentSlab;
    auto addSlab() noexcept -> void;
};



