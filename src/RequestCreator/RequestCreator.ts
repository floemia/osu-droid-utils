import { NewDroidUserResponse, ReplayRequestParameters, UserRequestParameters } from "~/structures";
import { MissingParametersError, MissingAPIKeyError } from "~/errors";
import { OsuAPIRequestBuilder } from "@rian8337/osu-base";
import { RXResponseRecentScore, RXResponseTopScore, RXResponseUser } from "~/structures/RXResponse";
const ibancho_page = "https://new.osudroid.moe/api2/frontend/"
const rx_page = "https://v4rx.me/api/"

/**
 * Utility class for creating requests.
 */
export abstract class RequestCreator {
    private static APIKeySet = false;


    static async tryFetch(url: string): Promise<Response | undefined> {
        try {
            const response = await fetch(url);
            if (response.status == 404) return undefined;
            return response;
        } catch (error) {
            throw new Error(`Error while fetching data: ${error}`);
        }
    }
    /**
     * Sends a request to https://new.osudroid.moe to get a user's data.
     * @param params An `Object` containing either a user's `id` or `username`.
     * @returns A `NewDroidUserResponse` object, containing the user's data.
     */
    static async getBanchoUser(params: UserRequestParameters): Promise<NewDroidUserResponse | undefined> {
        if (!params || !params.username && !params.uid) throw new MissingParametersError();
        let url = ibancho_page;
        if (params.uid) url += `profile-uid/${params.uid}`;
        else url += `profile-username/${params.username}`;
        const response = await this.tryFetch(url);
        if (!response) return undefined;
        return await response.json();
    }

    /**
     * Requests a user's avatar from https://osudroid.moe/user/avatar/.
     * @param uid The user's ID.
     * @returns A `string` containing the user's avatar URL.
     */
    static async getBanchoAvatar(uid: number): Promise<string> {
        const url = `https://osudroid.moe/user/avatar/${uid}.png`;
        const response = await this.tryFetch(url);
        if (!response) return `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`;
        return url;
    }

    /**
     * Given an ID, requests a score replay from https://osudroid.moe/api/upload/.
     * @param params An `Object` containing the score's ID and the type of score to retrieve.
     * @returns A `Buffer<ArrayBufferLike>` of the score's replay file.
     */
    static async getBanchoReplay(params: ReplayRequestParameters): Promise<Buffer<ArrayBufferLike> | undefined> {
        let url = `https://osudroid.moe/api/`;
        if (!params.best) params.best = "score";
        if (params.best == "score") url += `upload/${params.id}.odr`;
        else url += `bestpp/${params.id}.odr`;
        const response = await this.tryFetch(url);
        if (!response) return undefined;
        return Buffer.from(await response.arrayBuffer());
    }

    static async getRXUser(params: UserRequestParameters): Promise<RXResponseUser| undefined> {
        if (!params || !params.username && !params.uid) throw new MissingParametersError();
        let url = rx_page + "get_user/";
        if (params.uid) url += `?id=${params.uid}`;
        else url += `?name=${params.username}`;
        const response = await this.tryFetch(url);
        if (!response) return undefined;
        return await response.json();
    }

    static async getRXRecentScores(id: number): Promise<RXResponseRecentScore[] | undefined> {
        let url = rx_page + `get_scores/?id=${id}`;
        const response = await this.tryFetch(url);
        if (!response) return undefined;
        return await response.json();
    }

    static async getRXTopScores(id: number): Promise<RXResponseTopScore[] | undefined> {
        let url = rx_page + `top_scores/?id=${id}`;
        const response = await this.tryFetch(url);
        if (!response) return undefined;
        return await response.json();
    }

    static async getRXAvatar(id: number): Promise<string> {
        const url = `https://v4rx.me/user/avatar/${id}.png`;
        const response = await this.tryFetch(url);
        if (!response) return `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`;
        return url;
    }

    static setOsuAPIKey(): void {
        if (this.APIKeySet) return;
        const key = process.env.OSU_API_KEY;
        if (!key) throw new MissingAPIKeyError();
        OsuAPIRequestBuilder.setAPIKey(key);
        this.APIKeySet = true;
    }
}