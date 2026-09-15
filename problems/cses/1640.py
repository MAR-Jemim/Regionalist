# import sys
# sys.stdin = open("../../input.txt", 'r')
# sys.stdout = open("../../output.txt", 'w')
# sys.stderr = open("../../output.txt", 'a')

n, x = map(int, input().split())
l = list(map(int, input().split()))

# Trial 3: i will sort with index and got WA for forgetting to print impossible.
# Trial 4: added impossible. all AC at 39th min.
l = sorted(enumerate(l, 1), key=lambda y: y[1])
i, j = 0, n-1

while i<j:
  if l[i][1] + l[j][1] == x:
    print(l[i][0], l[j][0])
    break
  elif l[i][1] + l[j][1] < x:
    i += 1
  else:
    j -= 1
else:
  print('IMPOSSIBLE')



# def solve():
#   n, x = map(int, input().split())
#   l = list(map(int, input().split()))
#   # trial 2: I can't sort! otherwise 2-pointer would be used.
#   # let's try to find closest to x, then find complement. it is not guranteed.
#   # WA: forgot to make 1-indexed.
#   # Trial 3: Amazingly just 2 WA though it is not completely accurate.
#   close1 = close2 = 0
#   for i in range(1, n):
#     if l[i] > l[close1] and l[i] < x:
#       close1 = i
#     elif l[i] > l[close2] and l[i] < l[close1]:
#       close2 = i
#
#   # print(close1, close2)
#   for i in range(n):
#     if i == close1:
#       continue
#     if l[i] + l[close1] == x:
#       print(i+1, close1+1)
#       return
#
#   for i in range(n):
#     if i == close2:
#       continue
#     if l[i] + l[close2] == x:
#       print(i+1, close2+1)
#       return
#   print('IMPOSSIBLE')  # (-_-)
#
# solve()

# Trial 1: Brute force. got several TLE (expected), but 2 WA -_-
# forgot to break outer loop
# n, x = map(int, input().split())
# l = list(map(int, input().split()))
# flag = True
# for i in range(n-1):
#     for j in range(i+1, n):
#         if l[i] + l[j] == x:
#             print(i+1, j+1)
#             flag = False
#             break
# if flag: print('IMPOSSIBLE')

