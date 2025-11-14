import { Accuracy, MapInfo, ModCustomSpeed, Modes, ModMap, ModRateAdjust } from "@rian8337/osu-base";
import { DroidScoreParameters, ScoreRank } from "~/structures";
import { DroidDifficultyCalculator, DroidPerformanceCalculator, OsuDifficultyCalculator, OsuPerformanceCalculator, PerformanceCalculationOptions } from "@rian8337/osu-difficulty-calculator";
import { DroidBanchoScore } from "./DroidBanchoScore";
import lodash from "lodash";

/**
 * A class representing a generic osu!droid score.
 */
export class DroidScore {

    /**
     * The score's ID.
     */
    id: number | null = null;

    /**
     * The beatmap's filename.
     * 
     * WARNING: The filename is broken for some beatmaps.
     */
    filename: string = "";

    /**
     * The obtained amount of score.
     */
    total_score: number = NaN;

    /**
     * The obtained performance points.
     * Returns `null` if the beatmap is not ranked.
     */
    pp: number | null = NaN;

    /**
     * The achieved rank.
     */
    rank: ScoreRank = "D";

    /**
     * The achieved `Accuracy`.
     */
    accuracy: Accuracy = new Accuracy({});

    /**
     * The max combo achieved.
     */
    max_combo: number = NaN;

    /**
     * The `Date` the score was set at.
     */
    played_at: Date = new Date();
    /**
     * The beatmap's MD5 hash.
     * Use it to obtain the beatmap.
     */
    hash: string = "";

    /**
     * The applied mods.
     */
    mods: ModMap = new ModMap();

    /**
     * The beatmap of the score.
     */
    beatmap: MapInfo | undefined;

    /**
     * Whether `this.calculate()` has been called.
     */
    calculated: boolean = false;

    /**
     * The calculated difficulty and performance data of this score.
     * 
     * Only available after calling `this.calculate("osu")`.
     */
    private osu_perf: OsuPerformanceCalculator | undefined;

    /**
     * The calculated difficulty and performance data of this score.
     * 
     * Only available after calling `this.calculate("droid")`.
     */
    private droid_perf: DroidPerformanceCalculator | undefined;

    constructor(params?: DroidScoreParameters) {
        if (params) {
            this.id = params.id ?? null;
            this.filename = params.filename ?? "";
            this.total_score = params.total_score ?? 0;
            this.pp = params.pp ?? null;
            this.rank = params.rank ?? "D";
            this.accuracy = params.accuracy ?? new Accuracy({});
            this.max_combo = params.max_combo ?? 0;
            this.played_at = params.played_at ?? new Date();
            this.hash = params.hash ?? "";
            this.mods = params.mods ?? new ModMap();
            this.beatmap = params.beatmap ?? undefined;
            this.osu_perf = undefined;
            this.droid_perf = undefined;
        }
    }

    /**
     * Check if this score is a full combo.
     * 
     * The result won't be accurate if `this.beatmap` is `undefined`.
     * @returns A `boolean` indicating the result.
     */
    isFC(): boolean {
        return this.accuracy.nmiss == 0 && (this.beatmap ? this.beatmap.maxCombo == this.max_combo : true);
    }

    /**
     * Gets the custom speed rate of this score.
     * @returns The value of the `ModCustomSpeed`, if present.
     */
    getCustomSpeed(): number | undefined {
        return this.mods.get(ModCustomSpeed)?.trackRateMultiplier.value ?? undefined;
    }

    /**
     * Gets the combined speed rate of all `ModRateAdjust` mods present in this score.
     * @returns The value of the final speed rate multiplier.
     */
    getFinalSpeed(): number {
        let final_rate = 1;
        for (const mod of this.mods.values()) {
            if (mod instanceof ModRateAdjust) {
                final_rate *= mod.trackRateMultiplier.value;
            }
        }
        return final_rate;
    }

    /**
     * Gets the beatmap of this score
     * @returns The beatmap of this score.
     */
    async getBeatmap(): Promise<MapInfo<true> | undefined> {
        if (this.beatmap || this.calculated) return this.beatmap;
        const map = await MapInfo.getInformation(this.hash);
        if (!map) return undefined;
        this.beatmap = map;
        return map;
    }

    /**
     * Calculates performance and difficulty attributes of the score. 
     * @returns A `CalculatedData` object containing the calculated performance and difficulty attributes.
     */
    async calculate(mode: Modes): Promise<OsuPerformanceCalculator | DroidPerformanceCalculator | undefined> {
        if (this.calculated) {
            if (mode == "osu" && this.osu_perf) return this.osu_perf;
            if (mode == "droid" && this.droid_perf) return this.droid_perf;
        }
        const map = await this.getBeatmap();
        if (!map) return undefined;

        const calc_options: PerformanceCalculationOptions = {
            accPercent: this.accuracy,
            combo: this.max_combo,
        }
        if (this instanceof DroidBanchoScore && this.replay) {
            calc_options.aimSliderCheesePenalty = this.replay.sliderCheesePenalty.aimPenalty;
            calc_options.flashlightSliderCheesePenalty = this.replay.sliderCheesePenalty.flashlightPenalty;
            calc_options.tapPenalty = this.replay.tapPenalty;
        }

        this.calculated = true;
        if (mode == Modes.osu) {
            const osu_rating = new OsuDifficultyCalculator().calculate(map.beatmap, this.mods);
            this.osu_perf = new OsuPerformanceCalculator(osu_rating).calculate(calc_options);
            return this.osu_perf;
        }
        
        const droid_rating = new DroidDifficultyCalculator().calculate(map.beatmap, this.mods);
        this.droid_perf = new DroidPerformanceCalculator(droid_rating).calculate(calc_options);
        return this.droid_perf;
    }
    /**
     * Converts a score to full combo.
     * @param score A `DroidScore` instance.
     * @returns The same `DroidScore` instance converted to a FC.
     */
    static toFC(score: DroidScore): DroidScore {
        const fc = DroidScore.clone(score);
        if (score.isFC()) return fc;
        const count = score.accuracy
        fc.accuracy = new Accuracy({ n300: count.n300 + count.nmiss, n100: count.n100, n50: count.n50, nmiss: 0 });
        if (fc.beatmap) fc.max_combo = fc.beatmap.maxCombo!;
        if (fc instanceof DroidBanchoScore) { fc.osu_perf = undefined; fc.droid_perf = undefined; }
        fc.calculated = false;
        fc.id = null;
        return fc;
    }

    /**
     * Clones a score.
     * @param score A `DroidScore` instance.
     * @returns A new `DroidScore` instance with the same properties.
     */
    static clone(score: DroidScore): DroidScore {
        return lodash.cloneDeep(score);
    }
}