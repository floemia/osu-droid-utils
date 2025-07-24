# osu!droid utils!

This is a library that contains tools for osu!droid's main server, as well as osudroid!rx.

Still in development! There may be some issues.

# Installation

```
$ npm i @floemia/osu-droid-utils
```

# Usage

## Import
```ts
// main server!
import { DroidBanchoUser, DroidBanchoScore } from "@floemia/osu-droid-utils"
// rx server!
import { DroidRXUser } from "@floemia/osu-droid-utils"

// require() is also supported!

```
## Get a user and their scores
 - From the main server
```ts
// get a user!
const user = await DroidBanchoUser.get({ uid: 177955 });
// or, alernatively:
const user = await DroidBanchoUser.get({ username: "MG_floemia" });

const recent_scores = user.scores.recent; // a DroidBanchoScore[]
const top_scores = user.scores.top; // another DroidBanchoScore[]
```
- From osudroid!rx:
```ts
// get a user!
const user = await DroidRXUser.get({ uid: 177955 });
// or, alernatively:
const user = await DroidRXUser.get({ username: "MG_floemia" });

// necessary for rx! top/recent scores have their own endpoints!
// this format ensures compatibility if you're working
// with both servers at the same time
// but const recent_scores = await user.getRecentScores() works too!
await user.getRecentScores();
await user.getTopScores();

const recent_scores = user.scores.recent; // a DroidRXScore[]
const top_scores = user.scores.top; // another DroidRXScore[]
```
## Calculate a score's performance values
```ts
// considering that score is an instance of DroidScore
// or any of its subclasses
const data = await score.calculate()
```
## Convert a score to a full combo
```ts
// considering that score is an instance of DroidScore
// or any of its subclasses

// to convert to a FC accurately, score.beatmap must be present!
// call score.getBeatmap() or score.calculate() first.

const score_fc = DroidScore.toFC(score);

// calculate it!
const data_fc = await score_fc.calculate();
```



