#include "SimpleArenaAllocator.hpp"
#include "../prelude/Prelude.hpp"
using namespace Prelude;

#define MIN_SLAB_SIZE 8000


SimpleArenaAllocator::SimpleArenaAllocator(int _slabSize) {
    int fixedSlabSize = _slabSize;
    if (fixedSlabSize > MIN_SLAB_SIZE) {
        if (fixedSlabSize % 8 != 0) {
            fixedSlabSize = 8*(fixedSlabSize/8 + 1);
        }
        this->slabSize = _slabSize;
    } else {
        fixedSlabSize = MIN_SLAB_SIZE;
    }
#ifdef VERBOSE
    cout << "Created allocator with slabSize " << fixedSlabSize << endl;
#endif
    this->slabSize = fixedSlabSize;
    auto firstSlab = make_unique<unsigned char[]>(this->slabSize);
    this->slabs.push_front(move(firstSlab));
    this->currentSlab = this->slabs.front().get();
}


SimpleArenaAllocator::~SimpleArenaAllocator() {
    cout << "Arena destructor running!" << endl;
}


auto SimpleArenaAllocator::terminate() noexcept -> void {
    this->currentSlab = nullptr;
    //this->slabs.reset();
}


auto SimpleArenaAllocator::addSlab() noexcept -> void {
    this->slabs.push_front(make_unique<unsigned char[]>(this->slabSize));
    this->currentSlab = this->slabs.front().get();
    this->currentInd = 0;
}

