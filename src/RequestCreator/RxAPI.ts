import { UserRequestParameters, UserScoresRequestParameters } from "~/structures";
import { BasicRequestCreator } from "./BasicRequestCreator";
import { RXResponse, RXScoreResponse, RXUserResponse } from "~/structures/RX";

export abstract class RxAPI extends BasicRequestCreator {
    static readonly base_url = "https://v4rx.me/api/";

    /**
     * Requests data of a user from https://v4rx.me.
     * @param params An `Object` containing either a user's `id` or `username`.
     * @returns A `RXUserResponse` object, containing the user's raw data.
     */
    static async getUser(params: UserRequestParameters): Promise<RXUserResponse | undefined> {
        if (!params || !params.username && !params.uid) throw new Error("No parameters were provided.");
        const endpoint = params.uid ? `get_user/?id=${params.uid}` : `get_user/?username=${params.username}`;
        const response = await this.tryFetch(this.base_url + endpoint);
        if (!response) return undefined;
        const response_json = await response.json() as RXResponse<RXUserResponse>;
        return response_json.data;
    }

    /**
     * Requests a user's scores from https://v4rx.me.
     * @param params An `Object` containing the user's `id` and the type of scores to retrieve.
     * @returns A `RXUserResponse` object, containing the user's scores raw data.
     */
    public static async getScores(params: UserScoresRequestParameters): Promise<RXScoreResponse[] | undefined> {
        const endpoint = params.type == "recent" ? `get_scores/?id=${params.id}` : `top_scores/?id=${params.id}`;
        const response = await this.tryFetch(this.base_url + endpoint + "&limit=50");
        if (!response) return undefined;
        const response_json = await response.json() as RXResponse<RXScoreResponse[]>;
        return response_json.data;
    }
}