/**
 * Parameters for a user request.
 */
export interface UserRequestParameters {
    /**
     * The user's username.
     */
    username?: string;

    /**
     * The user's ID.
     */
    uid?: number;
}

/**
 * Parameters for a replay request.
 */
export interface ReplayRequestParameters {
    /**
     * The score's ID.
     */
    id: number;
    /**
     * Type of the retrieved score (best in terms of score amount or pp).
     * 
     * Defaults to `score`.
     */
    best?: "score" | "pp";
}