import { RXResponseUser } from "~/structures/RXResponse";
import { DroidUser } from "./DroidUser";
import { DroidRXUserScores, UserRequestParameters } from "~/structures";
import { RequestCreator } from "~/RequestCreator";
import { DroidRXScore } from "~/DroidScore";

/**
 * A class representing a user of the osudroid!rx server.
 */
export class DroidRXUser extends DroidUser {
    /**
     * Whether the user is online or not.
     */
    public online: boolean;

    /**
     * The user's... prefix?
     * 
     * TODO: Find out what this is.
     */
    public prefix: string | null;

    /**
     * The user's scores.
     */
    public scores: DroidRXUserScores;

    /**
     * 
     * @param response The raw response data from https://v4rx.me/api/get_user/.
     */
    constructor(response: RXResponseUser) {
        super();
        this.id = response.id;
        this.username = response.name;
        this.country = response.country;
        this.url = "https://v4rx.me/user/profile.php/?id=" + response.id;
        this.online = response.online;
        this.prefix = response.prefix;
        this.statistics = {
            playcount: response.stats.plays,
            total_score: response.stats.total_score,
            pp: response.stats.pp,
            accuracy: response.stats.accuracy / 100,
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
        const response = await RequestCreator.getRXUser(params);
        if (!response) return undefined;
        const user = new DroidRXUser(response);
        user.avatar_url = await RequestCreator.getRXAvatar(response.id);
        return user;
    }

    /**
     * Gets the user's recent scores from https://v4rx.me/api/get_scores/.
     * 
     * @returns A `DroidRXScore[]` containing the user's recent scores.
     */
    async getRecentScores(): Promise<DroidRXScore[]> {
        const scores = await RequestCreator.getRXRecentScores(this.id);
        this.scores.recent = scores!.map(score => new DroidRXScore(score));
        return this.scores.recent;
    }

    /**
     * Gets the user's top scores from https://v4rx.me/api/top_scores/.
     * 
     * @returns A `DroidRXScore[]` containing the user's top scores.
     */
    async getTopScores(): Promise<DroidRXScore[]> {
        const scores = await RequestCreator.getRXTopScores(this.id);
        this.scores.top = scores!.map(score => new DroidRXScore(score));
        return this.scores.top;
    }
}