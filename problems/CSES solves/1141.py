# Pattern:
# Invariant: check contains exactly the elements in l[i:j+1], and all of them are distinct.
# Data Structure: set for lookup. 2-pointer. if does not exist in window increase right
#                 if exists increase left until it is removed. keep max length.
# Time Complexity: O(n)

n = int(input())
l = list(map(int, input().split()))

# Trial 1: 8 AC, 1 WA, 12 TLE (13 min)
i = j = 0

check = set()
mx = j - i + 1
while j < n:
    if l[j] not in check:
        check.add(l[j])
        mx = max(mx, j - i + 1)
        j += 1
    else:
        # while j in check: # after review: this is main culprit and it is red card.
        while l[j] in check: # trial 2: change in the condition. (AC at 16 min)
            check.remove(l[i])
            i += 1
print(mx)