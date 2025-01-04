import { ScopeToKeys } from '../types/valkeygen/config-mapper';
import {
	IsReadonlyConfig,
	IsValidValkeyKeysConfig2,
	ValkeyKeysConfigParam,
	ValkeyKeysConfigScope,
	ValkeyKeysConfigTemplateArray,
	ValkeyKeyTemplatesMapScope,
} from '../types/valkeygen/key-config';
import {
	isValkeyKeyParam,
	validateValkeyKeyTemplate,
	isScopeLike,
	validateDelimiter,
	validateValkeyKeyConfig,
} from './validators';

export const createValkeyKeyParam = <T extends string>(
	name: T
): ValkeyKeysConfigParam<T> => {
	return {
		name,
	};
};

const createTemplateStringFormTemplateArray = (
	templateArray: ValkeyKeysConfigTemplateArray,
	delimiter: string
): string | null => {
	validateValkeyKeyTemplate(templateArray);

	if (templateArray.length === 0) {
		return null;
	}

	const templateString = templateArray
		.map((templateMember) => {
			if (isValkeyKeyParam(templateMember)) {
				return `%${templateMember.name}%`;
			}

			return templateMember;
		})
		.join(delimiter);

	return templateString;
};

const createTemplateLeaf = (
	parentTemplateString: string | null,
	leafKeyTemplateArray: ValkeyKeysConfigTemplateArray,
	delimiter: string
): string | null => {
	validateValkeyKeyTemplate(leafKeyTemplateArray);

	const templateString = createTemplateStringFormTemplateArray(
		leafKeyTemplateArray,
		delimiter
	);

	if (parentTemplateString != null && parentTemplateString.length > 0) {
		return [parentTemplateString, templateString].join(delimiter);
	}

	return templateString;
};

const createTemplateScope = (
	parentTemplateString: string | null,
	scope: ValkeyKeysConfigScope,
	delimiter: string
): ValkeyKeyTemplatesMapScope => {
	const scopeTemplate: ValkeyKeyTemplatesMapScope = {};

	const scopeFirstPartString = createTemplateStringFormTemplateArray(
		scope.SCOPE_FIRST_PART,
		delimiter
	);

	for (const [key, value] of Object.entries(scope)) {
		if (key === 'SCOPE_FIRST_PART') {
			continue;
		}

		let templateString: string | null = null;

		if (parentTemplateString != null && parentTemplateString.length > 0) {
			templateString = [parentTemplateString, scopeFirstPartString].join(
				delimiter
			);
		} else {
			templateString = scopeFirstPartString;
		}

		// is leaf
		if (Array.isArray(value)) {
			scopeTemplate[key] =
				createTemplateLeaf(templateString, value, delimiter) ||
				parentTemplateString ||
				'';
		} else if (isScopeLike(value)) {
			// is scope
			scopeTemplate[key] = createTemplateScope(
				templateString,
				value,
				delimiter
			);
		}
	}

	return scopeTemplate;
};

export const createValkeyKeysMap = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Record<string, any>,
	Delimiter extends string = ':',
	K = IsValidValkeyKeysConfig2<T> extends true ? 'valid' : 'invalid',
	ReturnValue = 'valid' extends K
		? IsReadonlyConfig<T> extends 'yes'
			? ScopeToKeys<T>
			: ScopeToKeys<T>
		: never
>(
	redisKeysConfig: T,
	optionalDelimiter?: Delimiter
): ReturnValue => {
	if (optionalDelimiter != null) {
		validateDelimiter(optionalDelimiter);
	}

	const delimiter = optionalDelimiter || ':';

	validateValkeyKeyConfig(redisKeysConfig);

	const map: ValkeyKeyTemplatesMapScope = createTemplateScope(
		null,
		redisKeysConfig as unknown as ValkeyKeysConfigScope,
		delimiter
	);

	return map as unknown as ReturnValue;
};
