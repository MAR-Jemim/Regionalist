"""Pull your Codeforces record and print the things that actually decide rating:
what difficulty you practise at, which tags you avoid, and how often you submit wrong.

    python3 tools/cfstats.py proBOT001

Needs no libraries. Falls back to curl because this machine's Python
has no SSL root certificates configured.
"""
import json
import ssl
import subprocess
import sys
import urllib.request
from collections import Counter

API = "https://codeforces.com/api/"


def api(method):
  url = API + method
  try:
    with urllib.request.urlopen(url, timeout=40) as r:
      data = json.load(r)
  except (ssl.SSLError, urllib.error.URLError):
    # Python here has no root certs; curl does.
    out = subprocess.run(["curl", "-s", "--max-time", "40", url],
                         capture_output=True, text=True).stdout
    data = json.loads(out)
  if data.get("status") != "OK":
    sys.exit("Codeforces said: " + str(data.get("comment")))
  return data["result"]


def bar(n, total, width=30):
  return "#" * round(n / max(total, 1) * width)


def main():
  handle = sys.argv[1] if len(sys.argv) > 1 else "proBOT001"

  info = api("user.info?handles=" + handle)[0]
  subs = api("user.status?handle=" + handle)

  cur, mx = info.get("rating"), info.get("maxRating")
  print(f"\n{info['handle']}  —  rating {cur}  (max {mx})  {info.get('rank','')}")
  if cur and mx and cur < mx - 50:
    print(f"  You are {mx - cur} below your peak.")

  solved = {}
  for s in subs:
    if s["verdict"] == "OK" and s["problem"].get("contestId"):
      key = f"{s['problem']['contestId']}-{s['problem']['index']}"
      solved.setdefault(key, s["problem"])

  verdicts = Counter(s["verdict"] for s in subs)
  ok = verdicts["OK"]
  bad = sum(v for k, v in verdicts.items() if k != "OK")
  print(f"\n{len(solved)} problems solved · {len(subs)} submissions · "
        f"{bad / max(len(subs), 1) * 100:.0f}% not accepted")

  langs = Counter(s["programmingLanguage"] for s in subs)
  slow = sum(v for k, v in langs.items() if k.startswith("Python"))
  if slow:
    print(f"  {slow} submissions sent as CPython — those should be PyPy 3-64.")

  # ---- difficulty distribution: the number that decides whether rating moves
  rated = sorted(p["rating"] for p in solved.values() if p.get("rating"))
  if rated:
    print("\nWHAT DIFFICULTY YOU ACTUALLY PRACTISE AT")
    bands = Counter(r // 100 * 100 for r in rated)
    top = max(bands.values())
    for b in sorted(bands):
      flag = ""
      if cur and b < cur - 100:
        flag = "  <- below your rating, does not teach you anything"
      print(f"  {b:>4}  {bands[b]:>3}  {bar(bands[b], top)}{flag}")
    easy = sum(v for k, v in bands.items() if cur and k < cur)
    print(f"\n  {easy}/{len(rated)} ({easy / len(rated) * 100:.0f}%) of your solves "
          f"are below your current rating.")
    if cur:
      print(f"  To gain rating, most practice should sit at {cur + 100}–{cur + 300}.")

  # ---- tag gaps
  tags = Counter(t for p in solved.values() for t in p.get("tags", []))
  print("\nTAGS YOU HAVE TOUCHED")
  for t, c in tags.most_common(10):
    print(f"  {t:<26} {c}")

  core = ["binary search", "two pointers", "dfs and similar", "graphs",
          "dp", "trees", "shortest paths", "dsu", "data structures",
          "number theory", "bitmasks", "combinatorics"]
  missing = [(t, tags.get(t, 0)) for t in core if tags.get(t, 0) < 5]
  if missing:
    print("\nCORE TOPICS YOU HAVE BARELY DONE  (under 5 solves each)")
    for t, c in missing:
      print(f"  {t:<26} {c}")
    print("\n  These are the topics standing between you and 1300+.")

  try:
    hist = api("user.rating?handle=" + handle)
  except SystemExit:
    hist = []
  if hist:
    print(f"\nLAST {min(8, len(hist))} CONTESTS")
    for e in hist[-8:]:
      d = e["newRating"] - e["oldRating"]
      print(f"  {e['contestName'][:40]:<42} {e['oldRating']:>5} -> "
            f"{e['newRating']:<5} {d:+d}")
  print()


main()
