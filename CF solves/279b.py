# Problem: B. Books || Contest: Codeforces - Codeforces Round 171 (Div. 2)
# Memory: 256 MB
# Time      : 2000 ms

# Bismillahir Rahmanir Rahim

import sys

input = sys.stdin.readline

n, k = map(int, input().split())
l = list(map(int, input().split()))

cur = mx = 0

i = j = 0

while j < n:
  if cur + l[j] <= k:
    cur += l[j]
    mx = max(mx, j - i + 1)

  else:
    cur += l[j]
    while cur > k:
      cur -= l[i]
      i += 1
    mx = max(mx, j - i + 1)
  j += 1

print(mx)