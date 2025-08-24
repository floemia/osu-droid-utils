import { RXUserResponse } from "~/structures/RX";
import { DroidUser } from "./DroidUser";
import { DroidRXUserScores, UserRequestParameters } from "~/structures";
import { DroidRXScore } from "~/DroidScore";
import { RxAPI } from "~/RequestCreator";

/**
 * A class representing a user of the osudroid!rx server.
 */
export class DroidRXUser extends DroidUser {
    /**
     * Whether the user is online or not.
     */
    online: boolean | null;

    /**
     * The user's prefix.
     * 
     */
    prefix: string | null;

    /**
     * The user's scores.
     */
    private scores: DroidRXUserScores;

    constructor(response: RXUserResponse) {
        super();
        this.id = response.id;
        this.username = response.username;
        this.country = response.country;
        this.url = "https://v4rx.me/user/profile.php/?id=" + response.id;
        this.online = response.online;
        this.prefix = response.prefix;
        this.avatar_url = `https://v4rx.me/user/avatar/${response.id}.png`;
        this.statistics = {
            playcount: response.stats.plays,
            total_score: response.stats.tscore,
            pp: response.stats.pp,
            // divide by 100 for consistency between this and DroidBanchoUser
            accuracy: response.stats.acc / 100,
            rank: {
                global: response.stats.pp_rank,
                country: response.country ? response.stats.country_pp_rank : null
            }
        }
        this.scores = {
            top: [],
            recent: []
        }
    }

    /**
     * A method that gets a user from the osudroid!rx server.
     * @param params An `Object` containing either a user's `id` or `username`.
     * @returns A `DroidRXUser` instance.
     */
    static async get(params: UserRequestParameters): Promise<DroidRXUser | undefined> {
        const response = await RxAPI.getUser(params);
        if (!response) return undefined;
        return new DroidRXUser(response);
    }

    /**
     * Gets the user's recent scores from https://v4rx.me/api/get_scores/.
     * @returns A `DroidRXScore[]` containing the user's recent scores.
     */
    async getRecentScores(): Promise<DroidRXScore[]> {
        if (this.statistics.playcount == 0) return [];
        const scores = await RxAPI.getScores({ id: this.id, type: "recent" });
        this.scores.recent = scores!.map(score => new DroidRXScore(score));
        return this.scores.recent;
    }

    /**
     * Gets the user's top scores from https://v4rx.me/api/top_scores/.
     * @returns A `DroidRXScore[]` containing the user's top scores.
     */
    async getTopScores(): Promise<DroidRXScore[]> {
        if (this.statistics.playcount == 0) return [];
        const scores = await RxAPI.getScores({ id: this.id, type: "top" });
        this.scores.top = scores!.map(score => new DroidRXScore(score));
        return this.scores.top;
    }

}