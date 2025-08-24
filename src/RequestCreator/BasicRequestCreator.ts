/**
 * Utility class for creating requests.
 */
export abstract class BasicRequestCreator {

    static async tryFetch(url: string): Promise<Response | undefined> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status == 404) return undefined;
                throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            throw new Error(`Error while fetching data: ${error}`);
        }
    }
}