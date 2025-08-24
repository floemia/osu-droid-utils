import { DroidBanchoUserScores, UserRequestParameters } from "~/structures";
import { DroidBanchoScore } from "~/DroidScore";
import { DroidUser } from "./DroidUser";
import { BanchoUserResponse } from "~/structures/iBancho";
import { iBanchoAPI } from "~/RequestCreator";

/**
 * A class representing a user of the osu!droid main server.
 */
export class DroidBanchoUser extends DroidUser {

    /**
     * The `Date` this user was registered at.
     */
    registered: Date;

    /**
     * The `Date` of this user's last login.
     */
    last_login: Date;

    /**
     * The user's scores.
     */
    private scores: DroidBanchoUserScores

    constructor(response: BanchoUserResponse) {
        super();
        this.id = response.UserId;
        this.username = response.Username;
        this.country = response.Region;
        this.url = "https://osudroid.moe/profile.php?uid=" + response.UserId;
        this.avatar_url = `https://osudroid.moe/user/avatar/${response.UserId}.png`;
        this.statistics = {
            playcount: response.OverallPlaycount,
            total_score: response.OverallScore,
            pp: response.OverallPP,
            accuracy: response.OverallAccuracy,
            rank: {
                global: response.GlobalRank,
                country: response.CountryRank
            }
        }
        this.registered = new Date(response.Registered);
        this.last_login = new Date(response.LastLogin);
        this.scores = {
            top: response.Top50Plays.map(score => new DroidBanchoScore(score)),
            recent: response.Last50Scores.map(score => new DroidBanchoScore(score))
        }
    }

    
    /**
     * A method that gets a user from osu!droid's main server.
     * @param params An `Object` containing either a user's `id` or `username`.
     * @returns A `DroidBanchoUser` instance.
     */
    static async get(params: UserRequestParameters): Promise<DroidBanchoUser | undefined> {
        const response = await iBanchoAPI.getUser(params);
        if (!response) return undefined;
        return new DroidBanchoUser(response);
    }

    /**
     * Get this user's top 50 scores.
     * @returns A `DroidBanchoScore[]` containing this user's top 50 scores.
     */
    getTopScores(): DroidBanchoScore[] {
        return this.scores.top;
    }

    /**
     * Get this user's recent 50 scores.
     * @returns A `DroidBanchoScore[]` containing this user's recent 50 scores.
     */
    getRecentScores(): DroidBanchoScore[] {
        return this.scores.recent;
    }
}