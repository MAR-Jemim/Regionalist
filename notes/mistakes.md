___Every wrong submission, written down once so it does not happen twice.___

The point of this file is not to feel bad. It is that a mistake you have
named is a mistake you start checking for.

## The pattern behind most of my WAs

As of September 2026: **212 submissions, 101 accepted — 52% of what I send is wrong.**

That is not a knowledge problem. Almost every one of these was a thing I
already knew, but did not check before hitting submit. In ICPC that is 20
penalty minutes each time.

---

## Recurring mistakes

### 1. Forgetting the "no answer" branch
- **CSES 1640 (Sum of Two Values):** WA for forgetting to print `IMPOSSIBLE`.
- **Check:** does the statement define what to output when no answer exists?

### 2. 1-indexed vs 0-indexed
- **CSES 1640:** forgot to make output 1-indexed.
- **Check:** does the problem want positions or values? Positions from 1 or from 0?
- **Fix:** use `enumerate(l, 1)` at read time so indices are never ambiguous later.

### 3. `if` where the loop needs `while`
- **CF 279B (Books):** shrank the window once instead of shrinking until valid.
- **Check:** in a sliding window, restoring validity may take several steps. It is
  almost always `while`, never `if`.

### 4. Not breaking out of the outer loop
- **CSES 1640, trial 1:** broke the inner loop, kept scanning, printed twice.
- **Fix:** put the search in a function and `return`, or use `for...else`.

### 5. Leftover debug output
- **CSES 1084 (Apartments):** printed `a` and `b` by accident.
- **Fix:** print debug to `sys.stderr`, never `stdout`. The judge ignores stderr.

### 6. Misreading a long statement
- **IUT IUPC 2026, problem D:** lost the problem to a misread. Game theory —
  missed whether *both players get turns*.
- **Fix:** before coding, write the win condition in one sentence in my own words.
  If I cannot, I have not understood it yet.

### 7. Submitting as CPython instead of PyPy
- **36 of my submissions** went in as `Python 3` rather than `PyPy 3-64`.
- Some of my 11 TLEs are probably this and nothing else.
- **Fix:** check the language dropdown every single time.

---

## Pre-submit checklist

Read this before every submission until it is automatic.

- [ ] n = 1, and the smallest legal input
- [ ] Is there a "no answer" / `IMPOSSIBLE` / `-1` case?
- [ ] 1-indexed or 0-indexed?
- [ ] Did I remove every debug `print`?
- [ ] Is the language set to **PyPy 3-64**?
- [ ] Any hidden O(n) inside a loop? (`list.pop(0)`, `x in list`, `s += c`, slicing)
- [ ] Did I actually read the last paragraph of the statement?

---

## Template

```
### Problem
Pattern:
Recognition:
Mistake:
Fix / what I check now:
```
