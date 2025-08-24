import { BanchoScoreResponse } from "./BanchoScoreResponse";

/**
 * The raw response data from `https://new.osudroid.moe/api2/frontend/profile-(uid|username)/`.
 */
export interface BanchoUserResponse {
    UserId: number;
    Username: string;
    GlobalRank: number;
    CountryRank: number;
    OverallScore: number;
    OverallPP: number;
    OverallPlaycount: number;
    OverallAccuracy: number;
    Registered: string;
    LastLogin: string;
    Region: string;
    Supporter: number;
    CoreDeveloper: number;
    Developer: number;
    Contributor: number;
    Top50Plays: BanchoScoreResponse[];
    Last50Scores: BanchoScoreResponse[];
}
