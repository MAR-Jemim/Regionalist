# find the invariant
# it is mod 4 in this case

for _ in range(int(input())):
  n = int(input())
  l = list(map(int, input().split()))
  c = d = 0
  for i in l:
    if i == 1:
      c += 1
    else:
      d += 1

  if n % 2 == 0 and abs(c - d) % 4 == 0:
    print('yes')
  else:
    print('no')

# This code can be shrunk down to 9 lines.