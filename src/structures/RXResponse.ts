import { ScoreRank } from "@rian8337/osu-base";

/**
 * The raw response data from https://v4rx.me/api/get_user/.
 */
export interface RXResponseUser {
    country: string | null;
    id: number;
    name: string;
    online: boolean;
    prefix: string | null;
    stats: {
        accuracy: number;
        country_pp_rank: number;
        country_score_rank: number;
        id: number;
        is_playing: boolean;
        plays: number;
        pp: number;
        pp_rank: number;
        ranked_score: number;
        score_rank: number;
        total_score: number;
    }
}

export interface RXRecentScoreBeatmap {
    ar: number;
    artist: string;
    bpm: number;
    creator: string;
    cs: number;
    hp: number;
    id: number;
    last_update: number;
    max_combo: number;
    md5: string;
    mode: number;
    od: number;
    set_id: number;
    star: number;
    status: 5;
    title: string;
    total_length: number;
    version: string;
}
/**
 * The raw response data from https://v4rx.me/api/get_scores/.
 */
export interface RXResponseRecentScore {
    acc: number;
    beatmap: RXRecentScoreBeatmap
    combo: number;
    date: number;
    hit100: number;
    hit300: number;
    hit50: number;
    hitgeki: number;
    hitkatsu: number;
    hitmiss: number;
    id: number;
    maphash: string;
    mods: string;
    pp: number;
    rank: ScoreRank;
    score: number;
    status: number;
}

/**
 * The raw response data from https://v4rx.me/api/top_scores/.
 */
export interface RXResponseTopScore {
    acc: number;
    combo: number;
    date: number;
    hit100: number;
    hit300: number;
    hit50: number;
    hitgeki: number;
    hitkatsu: number;
    hitmiss: number;
    id: number;
    maphash: string;
    mods: string;
    pp: number;
    rank: ScoreRank;
    score: number;
    status: number;
}