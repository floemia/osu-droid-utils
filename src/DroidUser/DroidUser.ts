import { DroidUserStats } from "~/structures";
/**
 * A class representing a generic osu!droid user.
 */
export class DroidUser {
    /**
     * The user's ID.
     */
    id: number;

    /**
     * The user's username.
     */
    username: string;

    /**
     * The user's hypothetical avatar URL.
     * 
     * If the user has no avatar, the URL will be invalid. Proceed with caution.
     */
    avatar_url: string;

    /**
     * The user's country.
     */
    country: string | null;

    /**
     * The user's page URL.
     */
    url: string;

    /**
     * The user's statistics.
     */
    statistics: DroidUserStats;

    constructor() {
        this.id = 0;
        this.username = "";
        this.avatar_url = "";
        this.country = null;
        this.url = "";
        this.statistics = {
            playcount: 0,
            total_score: 0,
            pp: 0,
            accuracy: 0,
            rank: {
                global: 0,
                country: null
            }
        }
    }
}