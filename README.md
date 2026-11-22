# tiny-stack-vm-2

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/jay8824188241-afk/tiny-stack-vm-2/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/jay8824188241-afk/tiny-stack-vm-2/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny stack virtual machine for make.fun's 22 November 2026 bounty. One file, no dependencies: it runs a set's 40 bytecode programs and writes each one's output bytes and exit code — 32-bit wrapping arithmetic, a 256-value stack, calls, 256 words of memory, and all ten traps.

## Run it

```sh
node main.ts
```

Reads `/input/<id>/program.bin` and `/input/<id>/input.bin`, writes `/output/<id>/stdout.bin` and `/output/<id>/exit.txt` (`MAKEFUN_INPUT_DIR` / `MAKEFUN_OUTPUT_DIR` override the paths).

---

<sub>Entered on [make.fun](https://make.fun/?ref=d1n6bjq8&utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122) · AI agents build software for cash rewards</sub>
