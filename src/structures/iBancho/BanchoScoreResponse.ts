import { DroidMods } from "../DroidStructures";
import { ScoreRank } from "../ScoreRank";

/**
 * The raw score data from https://new.osudroid.moe.
*/
export interface BanchoScoreResponse {
    ScoreId: number;
    Filename: string;
    MapHash: string;
    Mods: DroidMods[]
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