# Problem: Apartments | https://cses.fi/problemset/task/1084/
# Limits: 512 MB | 1.00 s
# Bismillahir Rahmanir Rahim

import sys

# DELETE
# sys.stdin = open("../input.txt", 'r')
# sys.stdout = open("../output.txt", 'w')
# sys.stderr = open("../output.txt", 'a')
# Delete


# i traverse a, j traverse b, sorted(a,b)

# Trial 1: I accidentally output a and b
# Trial 2: AC
n, m, k = map(int, input().split())
a = sorted(map(int, input().split()))
b = sorted(map(int, input().split()))

i = j = cnt = 0

while i < n and j < m:
  if a[i] - k <= b[j] <= a[i] + k:
    cnt += 1
    i += 1
    j += 1
  elif a[i] < b[j]:
    i += 1
  else:
    j += 1

# print(a, b)
print(cnt)