/**
 * An error that occurs when no parameters are provided.
 */
export class MissingParametersError extends Error {
	constructor() {
		super(`No parameters were provided.`);
		this.name = 'MissingParametersError';
	}
}