Current CF: 887 (max 1046)\
Target (1 month): 1100\
Target (3 months): 1300\
Target (Before ICPC): 1400–1500\
Dream: Top 30 Dhaka Regional

_Run `python3 tools/cfstats.py proBOT001` to refresh these numbers._

---

# The one thing to fix first

**67% of my solved problems are rated 800.** Only 11 of 87 are above 1100.

800s do not move rating. They are already inside what I can do. Rating moves when
I solve problems slightly above me — right now that means **1000–1200**, and by
next month 1100–1300.

New rule: **if I solve it in under 10 minutes, it does not count as practice.**

The second thing: **52% of my submissions are wrong.** See `mistakes.md`. Fixing
the pre-submit checklist is free rating — no new algorithms required.

---

# Phase 1: Core Patterns

Tag counts from Codeforces, September 2026. This is the honest picture.

- [x] Greedy (basic proofs) — 34 solves
- [x] Implementation / brute force — 38 / 21 solves
- [ ] **Two Pointers** — 1 solve
- [ ] **Sliding Window** — started (CF 279B)
- [ ] **Prefix Sum**
- [ ] **Binary Search** — 2 solves
    - [ ] Binary search on array
    - [ ] bisect_left
    - [ ] bisect_right
    - [ ] **Binary search on the answer** ← highest value single technique at my level
- [ ] Stack
- [ ] Monotonic stack
- [ ] **BFS** — 1 solve
- [ ] **DFS** — 1 solve
- [ ] **Union Find** — 0 solves

Graphs: 0 solves. Trees: 0 solves. DSU: 0 solves. That is where 1200–1400 lives.

# Phase 2: Python Toolkit

- [x] list
- [x] dict
- [x] set
- [ ] Counter
- [ ] defaultdict
- [ ] deque — needed before BFS is usable (`list.pop(0)` is O(n))
- [ ] heapq
- [ ] bisect — needed for binary search
- [ ] itertools (optional)

Also, for Python specifically:
- [ ] Always submit as **PyPy 3-64** (36 of my submissions were plain CPython)
- [ ] `input = sys.stdin.readline` in every solution
- [ ] `sys.setrecursionlimit(300000)` — or write DFS iteratively, which is safer
- [ ] Know that Python has no ordered set; use a Fenwick tree instead

# Phase 3: Fundamental Data Structures

- [ ] Coordinate Compression
- [ ] DSU (Union-Find)
- [ ] Fenwick Tree (BIT)
- [ ] Segment Tree (intro)

# Phase 4: Graph Basics

- [ ] Graph representation (adjacency list, 1-indexed)
- [ ] BFS — shortest path on unweighted graphs
- [ ] DFS — iterative, because of Python's recursion limit
- [ ] Connected Components
- [ ] Grid BFS/DFS
- [ ] Dijkstra

---

# Order I will actually go in

Driven by the tag gaps above, easiest win first:

1. **bisect + binary search on the answer** — biggest rating return at 900–1300
2. **Two pointers / sliding window** — already started, finish it
3. **Prefix sums** — cheap, unlocks a lot of 1100s
4. **deque + BFS** — opens every grid and maze problem
5. **Iterative DFS + connected components**
6. **DSU** — 15 lines, appears constantly
7. **Basic DP** — coin change, knapsack, LIS

Full topic tree, per-topic Python notes and auto-generated ladders:
the roadmap app in `docs/` (live at mar-jemim.github.io/Regionalist). Plug in
`proBOT001` and it ticks solved problems automatically and shows which tags I
am avoiding.
