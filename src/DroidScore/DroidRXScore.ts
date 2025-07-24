import { RXRecentScoreBeatmap, RXResponseRecentScore, RXResponseTopScore } from "~/structures/RXResponse";
import { DroidScore } from "./DroidScore";
import { Accuracy, ModCustomSpeed, ModUtil } from "@rian8337/osu-base";
import { NewDroidScoreMods } from "~/structures";

export class DroidRXScore extends DroidScore {
    /**
     * The beatmap of this score.
     * 
     * Only available if the score is obtained via recents.
     */
    public rs_beatmap: RXRecentScoreBeatmap | undefined;

    /**
     * 
     * @param score The raw score data from https://v4rx.me/api/(get_scores|top_scores)/.
     */
    constructor(score: RXResponseRecentScore | RXResponseTopScore) {
        super();
        this.id = score.id;
        this.filename = "";
        this.total_score = score.score;
        this.pp = score.pp;
        this.rank = score.rank;
        this.accuracy = new Accuracy({ n300: score.hit300, n100: score.hit100, n50: score.hit50, nmiss: score.hitmiss });
        this.max_combo = score.combo;
        this.played_at = new Date(score.date);
        this.hash = score.maphash;
        const mods = JSON.parse(score.mods) as NewDroidScoreMods[];
        this.mods = ModUtil.pcStringToMods(mods.map(mod => mod.acronym).join(""));
        mods.filter(mod => mod.acronym == "CS").forEach(mod => this.mods.set(new ModCustomSpeed(mod.settings?.rateMultiplier)));
        this.beatmap = undefined;
        if ("beatmap" in score) {
            this.rs_beatmap = score.beatmap;
            this.filename = `${score.beatmap.artist} - ${score.beatmap.title} (${score.beatmap.creator}) [${score.beatmap.version}]`;
        }
    }
}