## Two Pointers on Sorted Arrays

### Recognition
- Two arrays
- Need matching/pairing
- Condition based on difference/order
- Greedy after sorting

### Invariant
Elements before i and j are already decided.

### Pointer movement
- If left item is too small → move left pointer.
- If right item is too small → move right pointer.
- If they match → take the pair and move both.

### Example
- CSES Apartments