import { RXBeatmapResponse, RXScoreResponse } from "~/structures/RX";
import { DroidScore } from "./DroidScore";
import { Accuracy, ModCustomSpeed, ModUtil } from "@rian8337/osu-base";
import { DroidMods } from "~/structures";

export class DroidRXScore extends DroidScore {
    /**
     * The raw data of the beatmap of this score, provided by the osudroid!rx API.
     * 
     */
    public bmap: RXBeatmapResponse | null;

    constructor(score: RXScoreResponse) {
        super();
        this.id = score.id;
        this.filename = score.bmap ? `${score.bmap.artist} - ${score.bmap.title} (${score.bmap.creator}) [${score.bmap.version}]` : "";
        this.total_score = score.score;
        this.pp = score.pp;
        this.rank = score.grade;
        this.accuracy = new Accuracy({ n300: score.h300, n100: score.h100, n50: score.h50, nmiss: score.hmiss });
        this.max_combo = score.max_combo;
        this.played_at = new Date(score.date);
        this.hash = score.md5;
        this.bmap = score.bmap;

        const mods = JSON.parse(score.mods) as DroidMods[];
        this.mods = ModUtil.pcStringToMods(mods.map(mod => mod.acronym).join(""));
        mods.filter(mod => mod.acronym == "CS").forEach(mod => this.mods.set(new ModCustomSpeed(mod.settings?.rateMultiplier)));
    }
}