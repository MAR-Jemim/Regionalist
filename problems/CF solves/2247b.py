# passed almost an hour but no solution
# let's try how will they check my solution.
# they will try a resizable window with max size of k-1.
# sum(window) % m == 0
# so, i need to ensure that no such window exists.
# i was searching for several combination for 1.5 hour.
# i just can make array most of 1s -_-

# Trial 1: pretest passed : penalty 1hr 47min
# Trial 2: adding sys for precaution: pretest passed

import sys

input = sys.stdin.readline

for _ in range(int(input())):
  n, m, k = map(int, input().split())

  if m > k:
    print('No')
    continue

  sub = []
  for i in range(m - 1):
    sub.append(1)
  sub.append(k - m + 1)

  l = [0] * n
  for i in range(n):
    l[i] = sub[i % m]
  print('yes')
  print(*l)
