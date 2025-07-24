/**
 * An error that occurs when `OSU_API_KEY` is not provided in the .env file.
 */
export class MissingAPIKeyError extends Error {
	constructor() {
		super(`No API key was provided in the .env file as OSU_API_KEY.`);
		this.name = 'MissingAPIKeyError';
	}
}