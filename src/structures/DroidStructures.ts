import { DroidPerformanceCalculator, ExtendedDroidDifficultyAttributes, OsuDifficultyAttributes, OsuPerformanceCalculator } from "@rian8337/osu-difficulty-calculator";
import { DroidBanchoScore, DroidRXScore } from "~/DroidScore";
import { ScoreRank } from "./ScoreRank";
import { Accuracy, MapInfo, ModMap } from "@rian8337/osu-base";

export interface DroidScoreParameters {
    id?: number | null;
    filename?: string;
    total_score?: number;
    pp?: number | null;
    rank?: ScoreRank;
    accuracy?: Accuracy;
    max_combo?: number;
    played_at?: Date;
    hash?: string;
    mods?: ModMap;
    beatmap?: MapInfo;
}

/**
 * The global and country ranks of a user.
 */
export interface DroidUserRanks {
    /**
     * The user's global rank.
     */
    global: number;

    /**
     * The user's country rank.
     */
    country: number | null;
}

/**
 * The user's statistics.
 */
export interface DroidUserStats {
    /**
     * The user's playcount.
     */
    playcount: number;

    /**
     * The user's total score.
     */
    total_score: number;

    /**
     * The user's performance points.
     */
    pp: number;

    /**
     * The user's hit accuracy (0.0 - 1.0).
     */
    accuracy: number;

    /**
     * The user's global and country ranks.
     */
    rank: DroidUserRanks;
}

/**
 * Contains a main server user's scores.
 */
export interface DroidBanchoUserScores {
    /**
     * A list containing the user's top 50 scores.
     */
    top: DroidBanchoScore[];

    /**
     * A list containing the user's recent 50 scores.
     */
    recent: DroidBanchoScore[];
}

/**
 * Contains a osudroid!rx user's scores.
 */
export interface DroidRXUserScores {
    /**
     * A list containing the user's top 50 scores.
     * 
     * Needs to be initialized with `getTopScores()`.
     */
    top: DroidRXScore[];

    /**
     * A list containing the user's recent 50 scores.
     * 
     * Needs to be initialized with `getRecentScores()`.
     */
    recent: DroidRXScore[];
}
/**
 * Contains the calculated performance and difficulty attributes of a score.
 */
export interface PerformanceCalculators {
    /**
     * The osu!standard performance values.
     */
    osu: OsuPerformanceCalculator;

    /**
     * The osu!droid performance values.
     */
    droid: DroidPerformanceCalculator;
}

export interface DifficultyAttributes {
    /**
     * The osu!standard difficulty values.
     */
    osu: OsuDifficultyAttributes;
    /**
     * The osu!droid difficulty values.
     */
    droid: ExtendedDroidDifficultyAttributes;
}

/**
 * Contains the calculated performance and difficulty attributes of a score.
 */
export interface CalculatedData {
    /**
     * The calculators of the performance values.
     */
    performance: PerformanceCalculators;

    /**
     * The difficulty attributes.
     */
    difficulty: DifficultyAttributes;

    /**
     * Resulting BPM after applying mods.
     */
    bpm: number;

    /**
     * Resulting CS after applying mods.
     */
    cs: number;

    /**
     * Resulting OD after applying mods.
     */
    od: number;

    /**
     * Resulting AR after applying mods.
     */
    ar: number;

    /**
     * Resulting HP after applying mods.
     */
    hp: number;
}