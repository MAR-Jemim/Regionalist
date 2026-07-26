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

### CF 279B - Books

Pattern:
Sliding Window

Recognition:
Positive numbers + longest contiguous segment.

Invariant:
Window sum <= k.

Mistake:
Used if instead of while.

Remember:
Shrink until valid.

### CSES - Ferris Wheel

Pattern:
Greedy + Two Pointers

Recognition:
Pair people to minimize gondolas.

Invariant:
The heaviest person is always assigned.

Greedy Proof:
If the lightest can't fit with the heaviest,
nobody can.

Mistake:
Started pairing the lightest together.

## Ordered Set / Multiset

Recognition:
Need to maintain sorted values while inserting/deleting.

Operations:
- Find largest value <= x
- Find smallest value >= x
- Delete chosen value

C++:
multiset + lower_bound/upper_bound

Python:
No built-in equivalent.

Possible solutions:
- Fenwick Tree (with coordinate compression)
- Segment Tree
- Custom balanced tree (rare)

## Sliding Window
Recognition:
**Positive numbers** + contiguous segment.

Invariant:
Window always valid.

Template:
(my code)

## Greedy Choice
Always ask:
Why is this greedy choice safe?