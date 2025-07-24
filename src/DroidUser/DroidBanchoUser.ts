import { DroidBanchoUserScores, NewDroidUserResponse, UserRequestParameters } from "~/structures";
import { DroidBanchoScore } from "~/DroidScore";
import { RequestCreator } from "~/RequestCreator";
import { DroidUser } from "./DroidUser";

/**
 * A class representing a user of the osu!droid main server.
 */
export class DroidBanchoUser extends DroidUser {
    /**
     * The user's scores.
     */
    public scores: DroidBanchoUserScores

    /**
     * 
     * @param response The raw response data from https://new.osudroid.moe/api2/frontend/profile-(uid|username)/.
     */
    constructor(response: NewDroidUserResponse) {
        super();
        this.id = response.UserId;
        this.username = response.Username;
        this.country = response.Region;
        this.url = "https://osudroid.moe/profile.php?uid=" + response.UserId;
        this.avatar_url = "";
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
        const response = await RequestCreator.getBanchoUser(params);
        if (!response) return undefined;
        const user = new DroidBanchoUser(response);
        user.avatar_url = await RequestCreator.getBanchoAvatar(response.UserId);
        return user;
    }
}