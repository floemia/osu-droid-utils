import { MapInfo, Modes, ModMap, ModRateAdjust, ModUtil } from "@rian8337/osu-base";
import { DroidScore } from "~/DroidScore";
import { clone } from "lodash";

/**
 * Calculated beatmap attributes.
 */
export interface BeatmapCalculatedAttributes {
    /**
     * Calculated BPM.
     */
    bpm: number;
    /**
     * Calculated AR.
     */
    ar: number;
    /**
     * Calculated OD.
     */
    od: number;
    /**
     * Calculated CS.
     */
    cs: number;
    /**
     * Calculated HP.
     */
    hp: number;
}

/**
 * A class containing static methods for calculating attributes of a beatmap.
 */
export abstract class AttributesCalculator {

    /**
     * Calculates the difficulty attributes of a beatmap.
     * 
     * @param score The score to calculate the attributes of.
     * @param beatmap The beatmap to calculate the attributes of.
     * @param mods The applied mods.
     * @returns Calculated values of AR, OD, CS, HP, and BPM.
     */
    static calculate(score?: DroidScore, beatmap?: MapInfo<true>, mods?: ModMap, mode: Modes = Modes.droid): BeatmapCalculatedAttributes | undefined {
        if (score) {
            beatmap = score.beatmap;
            mods = score.mods;
        }
        if (!beatmap) return undefined;
        const diff = clone(beatmap.beatmap.difficulty);
        ModUtil.applyModsToBeatmapDifficulty(diff, mode, mods, true);
        return {
            ar: diff.ar,
            od: diff.od,
            cs: diff.cs,
            hp: diff.hp,
            bpm: beatmap.bpm * AttributesCalculator.getFinalSpeed(mods!)
        }
    }

    private static getFinalSpeed(mods: ModMap): number {
        let final_rate = 1;
        for (const mod of mods.values()) {
            if (mod instanceof ModRateAdjust) {
                final_rate *= mod.trackRateMultiplier.value;
            }
        }
        return final_rate;
    }

}