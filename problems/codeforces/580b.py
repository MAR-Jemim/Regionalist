# Problem: Kefa and Company
# Pattern: Sliding Window + Sorting
# Invariant: Current window has max_money - min_money <= d.
# Mistake: Forgot to add right element before shrinking.

# Pattern: if money differrence is more keep friend with more friendship factor (ff).
#          but 2 less ff friend can make more than 1 friend with more ff.
#          needs to be sorted
# Invariant: l[j] - l[i] <= d
# Data Structure: 2-pointer on sorted
# Time Complexity: n log n + n
# After coach review: this is still a sliding window, game continues.

n, d = map(int, input().split())
l = [0] * n

for i in range(n):
  l[i] = tuple(map(int, input().split()))
l.sort()
i = 0
ff = 0
mx = 0

for j in range(n):
  ff += l[j][1]

  while l[j][0] - l[i][0] >= d:
    ff -= l[i][1]
    i += 1

  mx = max(mx, ff)

print(mx)
# print(l)


# while j<n:
#     if l[j][0] - l[i][0] <= d:
#         ff += l[j][1]
#         j += 1
#     else:
#         while l[j][0] - l[i][0] > d:
#             ff -= l[i][1]
#             i += 1
#     # print(i, j, ff)
#     mx = max(mx, ff)


# print("expected: 100 ")