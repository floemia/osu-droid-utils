export interface RXUserResponse {
    country: string | null;
    id: number;
    online: boolean | null;
    prefix: string | null;
    stats: RXUserStatsResponse;
    username: string;
}

export interface RXUserStatsResponse {
    acc: number;
    country_pp_rank: number;
    country_score_rank: number;
    id: number;
    playing: string | null;
    plays: number;
    pp: number;
    pp_rank: number;
    rscore: number;
    score_rank: number;
    tscore: number;
}