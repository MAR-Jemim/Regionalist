"""Bismillah"""
# problem: CSES 1660 | Subarray Sums I
# AC at 11th min

n, x = map(int, input().split())
l = list(map(int, input().split()))

s = 0
c = 0
i = 0

for j in range(n):
    s += l[j]
    while s > x:
        s -= l[i]
        i += 1
    if s == x:
        c += 1

print(c)
