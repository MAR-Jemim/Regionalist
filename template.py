# Problem:
# Limits:  MB | 1.00 s
# Bismillahir Rahmanir Rahim

import sys

# ---- local testing: uncomment, delete before submitting ----
# sys.stdin  = open("../../input.txt", 'r')
# sys.stdout = open("../../output.txt", 'w')
# ------------------------------------------------------------

input = sys.stdin.readline          # ~5x faster than input()


def solve():
  n = int(input())
  a = list(map(int, input().split()))

  print(a)


def main():
  t = 1
  t = int(input())                  # delete this line if single test case
  for _ in range(t):
    solve()


main()

# Submit as PyPy 3-64, not Python 3.
#
# Before you hit submit, check:
#   [ ] n = 1 and the smallest possible input
#   [ ] 1-indexed vs 0-indexed
#   [ ] did I read every line the statement promises?
#   [ ] is the loop O(n) or did I hide an O(n) op inside it?
#       (list.pop(0), x in list, s += c, slicing)
