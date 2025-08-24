import { ReplayRequestParameters, UserRequestParameters } from "~/structures";
import { BasicRequestCreator } from "./BasicRequestCreator";
import { BanchoUserResponse } from "~/structures/iBancho";

export abstract class iBanchoAPI extends BasicRequestCreator {
    static readonly base_url = "https://new.osudroid.moe/api2/frontend/";
    static readonly old_base_url = "https://osudroid.moe/api/";

    /**
     * Requests data of a user from https://new.osudroid.moe.
     * @param params An `Object` containing either a user's `id` or `username`.
     * @returns A `NewDroidUserResponse` object, containing the user's data.
     */
    static async getUser(params: UserRequestParameters): Promise<BanchoUserResponse | undefined> {
        if (!params || !params.username && !params.uid) throw new Error("No parameters were provided.");
        const endpoint = params.uid ? `profile-uid/${params.uid}` : `profile-username/${params.username}`;

        const response = await this.tryFetch(this.base_url + endpoint);
        if (!response) return undefined;
        return await response.json();
    }

    /**
     * Given a score ID, get its replay from https://osudroid.moe/api/.
     * @param params An `Object` containing the score's ID and the type of score to retrieve.
     * @returns A `Buffer<ArrayBufferLike>` of the score's replay file.
     */
    static async getReplay(params: ReplayRequestParameters): Promise<Buffer<ArrayBufferLike> | undefined> {
        const endpoint = params.best == "score" ? `upload/${params.id}.odr` : `bestpp/${params.id}.odr`;
        const response = await this.tryFetch(this.old_base_url + endpoint);
        if (!response) return undefined;
        return Buffer.from(await response.arrayBuffer());
    }
}