import { ScoreRank } from "../ScoreRank";
import { RXBeatmapResponse } from "./RXBeatmapResponse";
import { RXUserResponse } from "./RXUserResponse";

export interface RXScoreResponse {
    acc: number;
    bmap: RXBeatmapResponse | null;
    date: number;
    fc: boolean | null;
    global_placement: number;
    grade: ScoreRank;
    h100: number;
    h300: number;
    h50: number;
    hmiss: number;
    id: number;
    local_placement: number;
    max_combo: number;
    md5: string;
    mods: string;
    player: RXUserResponse | null;
    pp: number;
    score: number;
    sliderendhits: number;
    slidertickhits: number;
    status: string;
}