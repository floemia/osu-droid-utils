import { ScoreRank } from "@rian8337/osu-base";

/**
 * The mods of a score.
 */
export interface NewDroidScoreMods {
    /**
     * The mod's acronym.
     */
    acronym: string;

    /**
     * The mod's options.
     */
    settings?: {

        /**
         * `ModCustomSpeed`'s speed multiplier.
         */
        rateMultiplier: number;
    }
}

/**
 * The raw response data from `https://new.osudroid.moe/api2/frontend/profile-(uid|username)/`.
 */
export interface NewDroidUserResponse {
    UserId: number;
    Username: string;
    GlobalRank: number;
    CountryRank: number;
    OverallScore: number;
    OverallPP: number;
    OverallPlaycount: number;
    OverallAccuracy: number;
    Registered: string;
    Region: string;
    Supporter: number;
    CoreDeveloper: number;
    Developer: number;
    Contributor: number;
    Top50Plays: NewDroidResponseScore[];
    Last50Scores: NewDroidResponseScore[];
}

/**
 * The raw score data from https://new.osudroid.moe.
*/
export interface NewDroidResponseScore {
    ScoreId: number;
    Filename: string;
    MapHash: string;
    Mods: NewDroidScoreMods[]
    MapScore: number;
    MapCombo: number;
    MapRank: ScoreRank;
    MapGeki: number;
    MapPerfect: number;
    MapKatu: number;
    MapGood: number;
    MapBad: number;
    MapMiss: number;
    MapAccuracy: number;
    MapPP: number | null;
    PlayedDate: string;
}