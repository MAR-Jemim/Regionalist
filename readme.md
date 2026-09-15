# Project Regionalist

![image](https://i.pinimg.com/236x/c8/ea/90/c8ea90cbad8266931107d0b069dcb226.jpg)  
CF Handle: [proBOT001](https://codeforces.com/profile/probot001)  
I have another test handle. I will reveal that if I see any success.

> Hi, I have a dream to participate in ICPC Asia West Regionals.
> But from a varsity like mine with fewer opportunities is
> beyond imagination. The first difficulty is to find teammates
> that I can connect with. It will be time-consuming to help 
> teammates grow as I have only few months left for my
> probably last ICPC. Yeah, I solved only 1 in ICPC 2024 and
> 2 problems in ICPC 2025 Dhaka regionals. I have a lot gap
> in me let alone help others grow. But I tried but failed.
> So, it literally has to be me solving 6 problems all by
> myself 😞 which feels imaginary.  
> **Let's try, make dua for me. InshaAllah I will try my best.**

Goal:
Top 30 ICPC Dhaka Regional

Language:
Python

Started:
July 2026

CF Rating: (max. 1046)

| Date      | Rating |
|:----------|-------:|
| September |    887 |
| August    |    903 |
| July      |    882 |

ICPC / IUPC Performance:

| ICPC / IUPC | Team Name          |   Rank    |     Solved      |
|-------------|--------------------|:---------:|:---------------:|
| IUT 2026    | IIUSTB_ZeroBug     | 89 / 112  | 2 / ~~8 / 12~~  |
| SUST 2026   | IIUSTB_ZeroBug     | 123 / 138 | 1 / ~~10 / 12~~ |
| DUET 2026   | IIUSTB_ZeroBug     | 118 / 139 | 2 / ~~9 / 11~~  |
| NDUB 2026   | IIUSTB_ZeroBug     |  61 / 86  | 2 / ~~6 / 10~~  |
| ICPC 2025   | IIUSTB_ZeroBug     | 136 / 313 | 2 / ~~7 / 10~~  |
| KUET 2025   | IIUSTB_Al-khwarizm | 132 / 161 | 1 / ~~8 / 11~~  |
| ICPC 2024   | IIUSTB_Al-khwarizm | 252 / 303 |        1        |
| BUET 2024   | IIUSTB_Silencer    | 104 / 114 | 2 / ~~7 / 12~~  |

---

## Repo layout

```
Regionalist/
├── docs/                the roadmap app (GitHub Pages serves this folder)
├── template.py          starting point for every solve
├── tools/
│   └── cfstats.py       pulls my CF record: difficulty mix, tag gaps, WA rate
├── problems/
│   ├── codeforces/
│   └── cses/
└── notes/
    ├── roadmap.md       what to learn next, and in what order
    ├── patterns.md      recognition -> invariant -> template, per pattern
    ├── mistakes.md      every WA, written down once
    └── contest_logs.md  per-contest post-mortems
```

## The roadmap app

`docs/` is a small web app: 91 topics from setup to ICPC, Python and C++ templates,
and live sync with my Codeforces handle. It auto-ticks what I have solved, ranks
the tags I am avoiding, and generates the next problems for each topic.

Live: <https://mar-jemim.github.io/Regionalist/>
Locally: `python3 -m http.server 8000 --directory docs`

See `docs/README.md` for how it works and how to edit topics.

## Where I actually stand

```
python3 tools/cfstats.py proBOT001
```

September 2026:

| | |
|:--|:--|
| Solved | 93 |
| Submissions | 212 (**52% not accepted**) |
| Solves rated 800 | 58 of 87 (**67%**) |
| graphs / trees / dsu | 0 / 0 / 0 solves |

The difficulty mix is the problem. 800-rated problems are already inside what I
can do, so they do not move rating. Practice belongs at 1000–1200 now.

Graphs, trees and DSU are at zero. That is exactly where 1200–1400 lives, and
it is reachable — BFS, DFS and DSU are a weekend each, not a semester.
