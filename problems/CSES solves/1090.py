# Problem: Ferris Wheel | https://cses.fi/problemset/task/1090/
# Limits: 512 MB | 1.00 s
# Bismillahir Rahmanir Rahim

import sys

# Trial 1: WA at 4, 7, 8, 10
n, x = map(int, input().split())
l = sorted(map(int, input().split()))

i = cnt = 0

# while i < n:
#   if i<n-1 and l[i] + l[i+1] <= x:
#     cnt += 1
#     i += 1
#   elif l[i] <= x:
#     cnt += 1
#   i += 1
# print(cnt)

# Trial 2: WA at 7, 8, 9, 10, 12 (12 min passed)
# j = n-1
#
# while i < j:
#   if l[i] + l[j] <= x:
#     cnt += 1
#     i += 1
#     j -= 1
#   elif l[i] <= x:
#     cnt += 1
#     i += 1
#   elif l[j] <= x:
#     cnt += 1
#     j -= 1
#
# print(cnt)

# Trial 3: WA for printing i, j
# Trial 4: RE at 2, 3, 8, 9 (am i racing? 17 min passed.) IndexError
# Trial 5: forgot to comment stdin
# Trial 6: WA at 7, 8 (20 min passed)
# j = n-1
#
# while i <= j:
#   # print(i, j)
#   if l[i] + l[j] <= x:
#     cnt += 1
#     i += 1
#     j -= 1
#   elif i<n-1 and l[i] + l[i+1] <= x:
#     cnt += 1
#     i += 2
#   elif l[i] <= x:
#     cnt += 1
#     i += 1
#
# print(cnt)

# Trial 7, 8: after coach review (total 28 min)
j = n-1

while i<=j:
  if l[j] + l[i] <= x:
    cnt += 1
    i += 1
  elif l[j] <= x:
    cnt += 1
  # print(i, j)
  j -= 1
print(cnt)