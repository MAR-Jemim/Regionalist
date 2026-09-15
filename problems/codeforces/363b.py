"""Bismillah"""
# problem: CF 363 B | Fench
# 2 WA
# AC at 12th min

n, k = map(int, input().split())
l = list(map(int, input().split()))

h = 0
for i in range(k):
    h += l[i]

wnd = h
j = 0
# print(h)
for i in range(k, n):
    wnd = wnd - l[i-k] + l[i]
    if wnd < h:
        j = i-k + 1
        h = wnd

print(j+1)