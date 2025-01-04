import {
	ValkeyKeysConfigParam,
	ValkeyKeysConfigScope,
	ValkeyKeysConfigTemplateArray,
	ScopeOrKeyTemplate,
} from '../types/valkeygen/key-config';

export const isValkeyKeyParam = (
	templateMember: string | ValkeyKeysConfigParam
): templateMember is ValkeyKeysConfigParam => {
	if (typeof templateMember === 'object' && templateMember.name) {
		return true;
	}

	if (typeof templateMember === 'string') {
		return false;
	}

	return false;
};

export const isValkeyKeyTemplate = (
	possibleTemplate: ScopeOrKeyTemplate
): possibleTemplate is ValkeyKeysConfigTemplateArray => {
	return (
		Array.isArray(possibleTemplate) &&
		possibleTemplate.every(
			(templateMember) =>
				isValkeyKeyParam(templateMember) || typeof templateMember === 'string'
		)
	);
};

export const validateValkeyKeyTemplate = (
	possibleTemplate: ScopeOrKeyTemplate
): void => {
	if (isValkeyKeyTemplate(possibleTemplate) === false) {
		throw new Error(
			`Redis Template Array must be an array of strings or Redis Key Param objects`
		);
	}
};

export const isScopeLike = (
	possibleScope: unknown
): possibleScope is ValkeyKeysConfigScope => {
	return (
		possibleScope != null &&
		typeof possibleScope === 'object' &&
		Object.keys(possibleScope).includes('SCOPE_FIRST_PART')
	);
};

export const isValidScope = (
	scope: unknown
): scope is ValkeyKeysConfigScope => {
	if (isScopeLike(scope)) {
		for (const [key, value] of Object.entries(scope)) {
			if (key === 'SCOPE_FIRST_PART') {
				if (isValkeyKeyTemplate(value) === false) {
					return false;
				}
			} else if (Array.isArray(value)) {
				if (isValkeyKeyTemplate(value)) {
					continue;
				} else {
					return false;
				}
			} else if (isScopeLike(value)) {
				if (isValidScope(value)) {
					continue;
				} else {
					return false;
				}
			} else {
				// Any other type is invalid
				return false;
			}
		}

		return true;
	}

	return false;
};

export const validateScope = (
	scope: unknown,
	parentPath: string | null
): void => {
	try {
		if (isScopeLike(scope)) {
			for (const [key, value] of Object.entries(scope)) {
				const keyPath = parentPath ? `${parentPath}.${key}` : '';

				if (key === 'SCOPE_FIRST_PART') {
					validateValkeyKeyTemplate(value);
				} else if (Array.isArray(value)) {
					validateValkeyKeyTemplate(value);
				} else if (isScopeLike(value)) {
					validateScope(value, keyPath);
				} else {
					// Any other type is invalid
					throw new Error(`Invalid Redis Key Scope on Path: <${keyPath}>`);
				}
			}
		} else {
			if (parentPath == null) {
				throw new Error(`Config Object itself is not a valid Redis Key Scope`);
			} else {
				throw new Error(`Invalid Redis Key Scope on Path: <${parentPath}>`);
			}
		}
	} catch (error) {
		let message = 'unknown error';

		if (error instanceof Error) {
			message = error.message;
		}

		throw new Error(message);
	}
};

export const validateValkeyKeyConfig = (redisKeyConfig: unknown): void => {
	try {
		validateScope(redisKeyConfig, null);
	} catch (error) {
		let message = 'unknown error';

		if (error instanceof Error) {
			message = error.message;
		}

		throw new Error('Redis Key Config is not valid: ' + message);
	}
};

export const validateDelimiter = (delimiter: unknown): void => {
	if (typeof delimiter !== 'string') {
		throw new Error('Delimiter must be a string');
	}

	if (delimiter === '' || delimiter.length === 0) {
		throw new Error('Delimiter cannot be empty string');
	}

	if (delimiter === '%') {
		throw new Error(
			'Invalid delimiter. Delimiter cannot be "%". This is used for params in Redis Key templates.'
		);
	}
};
