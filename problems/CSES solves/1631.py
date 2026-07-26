"""Bismillah"""
# problem: CSES 1631 | Reading Books
# pattern: feels like if max > sum of rest -> 2*max. else sum of all.
# invariant:
# structure: max, sum
# complexity: O(n)

n = int(input())
l = list(map(int, input().split()))
print(max(max(l)*2, sum(l)))

# 2 3 4 8 = 17
# 8       = 16
# 2 8     = 16
# 1 8 8   = 17
# 2 3 4 5 8 = 22