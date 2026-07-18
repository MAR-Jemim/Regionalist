# Problem: Concert Tickets | https://cses.fi/problemset/task/1091/
# Limits: 512 MB | 1.00 s
# Bismillahir Rahmanir Rahim

import sys

# DELETE
# sys.stdin = open("../input.txt", 'r')
# sys.stdout = open("../output.txt", 'w')
# sys.stderr = open("../output.txt", 'a')
# Delete

input = sys.stdin.readline
# Trial 1: could not all customer's price. WA at case 6, 11 (THIS IS DEFINITELY A TLE)
# Trial 2: added else:print(-1) after the while loop. (THIS IS DEFINITELY A TLE)
import heapq as hq

n, m = map(int, input().split())
h = list(map(int, input().split()))
cus = list(map(int, input().split()))

h.append(float('inf'))
hq.heapify(h)

for c in cus:
  store = []
  prev = hq.heappop(h)
  while h:
    if h[0] <= c:
      store.append(prev)
      prev = hq.heappop(h)
    else:
      if prev <= c:
        print(prev)
      else:
        print(-1)
        store.append(prev)
      break
  else:
    print(-1)
  for s in store:
    hq.heappush(h, s)