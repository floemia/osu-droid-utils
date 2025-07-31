import { DroidUserStats } from "~/structures";
/**
 * A class representing a generic osu!droid user.
 */
export class DroidUser {
    /**
     * The user's ID.
     */
    public id: number;

    /**
     * The user's username.
     */
    public username: string;

    /**
     * The user's avatar URL.
     */
    public avatar_url: string;

    /**
     * The user's country.
     */
    public country: string | null;

    /**
     * The user's page URL.
     */
    public url: string;

    /**
     * The user's statistics.
     */
    public statistics: DroidUserStats;

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