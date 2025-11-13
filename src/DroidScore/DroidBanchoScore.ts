import { ReplayRequestParameters } from "~/structures";
import { BanchoScoreResponse } from "~/structures/iBancho";
import { DroidScore } from "./DroidScore";
import { Accuracy, ModCustomSpeed, ModUtil } from "@rian8337/osu-base";
import { ReplayAnalyzer } from "@rian8337/osu-droid-replay-analyzer";
import { iBanchoAPI } from "~/RequestCreator";

/**
 * A class representing a score set on osu!droid's main server.
 */
export class DroidBanchoScore extends DroidScore {

    /**
     * A `ReplayAnalyzer` instance containing the score's replay data.
     */
    public replay: ReplayAnalyzer | undefined;

    constructor(score: BanchoScoreResponse | ReplayAnalyzer) {
        super();
        if (score instanceof ReplayAnalyzer) {
            const data = score.data as any;
            if (!data) return;
            this.id = score.scoreID!;
            this.filename = data.fileName;
            this.total_score = data.score;
            this.pp = null;
            this.max_combo = data.maxCombo;
            this.rank = data.rank;
            this.accuracy = data.accuracy;
            this.played_at = data.time;
            this.mods = data.convertedMods;
            this.hash = data.hash;
            this.beatmap = undefined;
            this.replay = score;
        } else {
            this.id = score.ScoreId;
            this.filename = score.Filename;
            this.total_score = score.MapScore;
            this.pp = score.MapPP;
            this.rank = score.MapRank;
            this.accuracy = new Accuracy({
                n300: score.MapPerfect,
                n100: score.MapGood,
                n50: score.MapBad,
                nmiss: score.MapMiss
            });
            this.max_combo = score.MapCombo;
            this.played_at = new Date(score.PlayedDate);
            this.hash = score.MapHash;
            this.mods = ModUtil.pcStringToMods(score.Mods.map(mod => mod.acronym).join(""));
            score.Mods.filter(mod => mod.acronym == "CS").forEach(mod => this.mods.set(new ModCustomSpeed(mod.settings?.rateMultiplier)));
            this.beatmap = undefined;
            this.replay = undefined;
        }
    }

    /**
     * Gets a score from osu!droid's main server using its ID.
     * @param params An `Object` containing the score's ID and the type of score to retrieve.
     * @returns A `DroidBanchoScore` instance.
     */
    static async get(params: ReplayRequestParameters): Promise<DroidBanchoScore | undefined> {
        const score_data = await iBanchoAPI.getReplay(params);
        if (!score_data) return undefined;
        const replay = new ReplayAnalyzer({ scoreID: params.id });
        replay.originalODR = score_data;
        await replay.analyze();
        return new DroidBanchoScore(replay);
    }

    /**
     * Gets the replay of this score.
     * 
     * Might be `undefined` for scores set before 27th of May, 2025 because of major data loss. 
     * @returns A `ReplayAnalyzer` instance of this score.
     */
    async getReplay(): Promise<ReplayAnalyzer | undefined> {
        if (!this.id) return undefined;
        if (this.replay) return this.replay;
        const replay_data = await iBanchoAPI.getReplay({ id: this.id });
        if (!replay_data) return undefined;
        const replay = new ReplayAnalyzer({ scoreID: this.id });
        replay.originalODR = replay_data;
        this.replay = await replay.analyze();
        this.replay.checkFor3Finger();
        this.replay.checkForSliderCheesing();
        return this.replay;
    }

    /**
     * Check for >=3 finger penalty.
     * 
     * Requires `.getReplay()` to be called first.
     * @returns The result of the check.
     */
    is3Finger(): boolean {
        return this.replay?.is3Finger ?? false;
    }

    /**
     * Check for slider cheese penalty.
     * 
     * Requires `.getReplay()` to be called first.
     * @returns The result of the check.
     */
    isSliderCheesed(): boolean {
        if (!this.replay) return false;
        const sc = this.replay.sliderCheesePenalty;
        return sc.aimPenalty != 1 || sc.flashlightPenalty != 1;
    }
}