# SnapDarts

![GitHub](https://img.shields.io/github/license/reizuseharu/SnapDarts)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/reizuseharu/SnapDarts)
![GitHub top language](https://img.shields.io/github/languages/top/reizuseharu/SnapDarts)

![GitHub issues](https://img.shields.io/github/issues-raw/reizuseharu/SnapDarts)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/reizuseharu/SnapDarts)

---

SnapDarts is a game for Pokémon Snap implemented as a web application.

## Usage

- Go to the [SnapDarts website](https://darts.snap.reizu.dev) which automatically generates a random seed for a goal list.
- Goals default to by stage, but seeds are unique to mode.
- Select mode and input seed (or leave empty if random desired)
- Click `Generate Goals`
  - List of goals should appear for a specific seed and mode
  - Timer preset (but can be changed)
  - Timer the same for all runners (linked through UUID)
- Two rulesets
  - **WINNER TAKE ALL**:
    - For each set of goals, the person closest to an individual goal gets 1 point at the end of the timer
    - Only first person to match goal exactly gets point
  - **CLOSE CUTS IT**:
    - For each set of goals, the person closest to an individual goal gets X points at the end of the timer, with the difference between the other runners being subtracted from their points.
    - First person to match goal gets X, second gets X - 1, third X - 2, etc.
- Runner with most points at the end of timer wins

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
