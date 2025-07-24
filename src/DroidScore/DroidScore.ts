import { Accuracy, MapInfo, ModCustomSpeed, Modes, ModMap, ModRateAdjust, ModRelax, ModUtil, } from "@rian8337/osu-base";
import { CalculatedData, DroidScoreParameters, ScoreRank } from "~/structures";
import lodash from "lodash";
import { RequestCreator } from "~/RequestCreator";
import { DroidDifficultyCalculator, DroidPerformanceCalculator, OsuDifficultyCalculator, OsuPerformanceCalculator, PerformanceCalculationOptions } from "@rian8337/osu-difficulty-calculator";
import { DroidBanchoScore } from "./DroidBanchoScore";

/**
 * A class representing a generic osu!droid score.
 */
export class DroidScore {

    /**
     * The score's ID.
     */
    public id: number | null = null;

    /**
     * The beatmap's filename.
     * 
     * WARNING: The filename is broken for some beatmaps.
     */
    public filename: string = "";

    /**
     * The obtained amount of score.
     */
    public total_score: number = NaN;

    /**
     * The obtained performance points.
     * Returns `null` if the beatmap is not ranked.
     */
    public pp: number | null = NaN;

    /**
     * The achieved rank.
     */
    public rank: ScoreRank = "D";

    /**
     * The achieved `Accuracy`.
     */
    public accuracy: Accuracy = new Accuracy({});

    /**
     * The max combo achieved.
     */
    public max_combo: number = NaN;

    /**
     * The `Date` the score was set at.
     */
    public played_at: Date = new Date();
    /**
     * The beatmap's MD5 hash.
     * Use it to obtain the beatmap.
     */
    public hash: string = "";

    /**
     * The applied mods.
     */
    public mods: ModMap = new ModMap();

    /**
     * The beatmap of the score.
     */
    public beatmap: MapInfo | undefined;

    /**
     * The calculated data of this score.
     */
    public calc_data: CalculatedData | undefined;

    /**
     * Whether `this.calculate()` has been called.
     */
    public calculated: boolean = false;

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
     * Gets the beatmap of this score.
     * @returns The beatmap of this score.
     */
    async getBeatmap(): Promise<MapInfo<true> | undefined> {
        if (this.beatmap || this.calculated) return this.beatmap;
        RequestCreator.setOsuAPIKey();
        const map = await MapInfo.getInformation(this.hash);
        if (!map) return undefined;
        this.beatmap = map;
        return map;
    }

    /**
     * Calculates performance and difficulty attributes of the score.
     * @returns A `CalculatedData` object containing the calculated performance and difficulty attributes.
     */
    async calculate(): Promise<CalculatedData | undefined> {
        if (this.calculated) return this.calc_data;
        const map = await this.getBeatmap();
        if (!map) return undefined;
        if (this instanceof DroidBanchoScore && !this.replay && this.id) this.replay = await this.getReplay()
        const mods = lodash.cloneDeep(this.mods);
        mods.delete(ModRelax);
        const droid_rating = new DroidDifficultyCalculator().calculate(map.beatmap, mods);
        const osu_rating = new OsuDifficultyCalculator().calculate(map.beatmap, mods);

        const calc_options: PerformanceCalculationOptions = {
            accPercent: this.accuracy,
            combo: this.max_combo,
        }
        if (this instanceof DroidBanchoScore && this.replay) {
            calc_options.aimSliderCheesePenalty = this.replay.sliderCheesePenalty.aimPenalty;
            calc_options.flashlightSliderCheesePenalty = this.replay.sliderCheesePenalty.flashlightPenalty;
            calc_options.visualSliderCheesePenalty = this.replay.sliderCheesePenalty.visualPenalty;
            calc_options.tapPenalty = this.replay.tapPenalty;
        }
        const droid_perf = new DroidPerformanceCalculator(droid_rating).calculate({
            accPercent: this.accuracy,
            combo: this.max_combo,
        });

        const osu_perf = new OsuPerformanceCalculator(osu_rating).calculate({
            accPercent: this.accuracy,
            combo: this.max_combo,
        });

        const diff_clone = lodash.cloneDeep(map.beatmap!.difficulty);
        ModUtil.applyModsToBeatmapDifficulty(diff_clone, Modes.osu, mods, true);

        this.calc_data = {
            performance: {
                droid: droid_perf,
                osu: osu_perf,
            },
            difficulty: {
                droid: droid_rating,
                osu: osu_rating,
            },
            bpm: this.beatmap?.bpm! * this.getFinalSpeed(),
            cs: diff_clone.cs,
            od: diff_clone.od,
            ar: diff_clone.ar,
            hp: diff_clone.hp
        };
        if (!this.filename) this.filename = map.fullTitle;
        if (!this.pp) this.pp = this.calc_data.performance.droid.total;
        this.calculated = true;
        return this.calc_data;
    }
    /**
     * Converts a score to full combo.
     * @param score A `DroidScore` instance.
     * @returns The same `DroidScore` instance converted to a FC.
     */
    static toFC(score: DroidScore): DroidScore {
        const fc = this.clone(score);
        if (score.isFC()) return fc;
        const count = score.accuracy
        fc.accuracy = new Accuracy({ n300: count.n300 + count.nmiss, n100: count.n100, n50: count.n50, nmiss: 0 });
        if (fc.beatmap) fc.max_combo = fc.beatmap.maxCombo!;
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