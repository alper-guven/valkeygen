import { ScopeToKeys } from '../types/config-mapper.js';
import {
	IsReadonlyConfig,
	IsValidValkeygenConfig2,
	ValkeygenConfigScope,
	ValkeygenConfigTemplateArray,
	ValkeyKeyTemplatesMapScope,
} from '../types/key-config.js';
import {
	isValkeyKeyParam,
	validateValkeyKeyTemplate,
	isScopeLike,
	validateDelimiter,
	validateValkeyKeyConfig,
} from './validators.js';

const createTemplateStringFormTemplateArray = (
	templateArray: ValkeygenConfigTemplateArray,
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
	leafKeyTemplateArray: ValkeygenConfigTemplateArray,
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
	scope: ValkeygenConfigScope,
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
	K = IsValidValkeygenConfig2<T> extends true ? 'valid' : 'invalid',
	ReturnValue = 'valid' extends K
		? IsReadonlyConfig<T> extends 'yes'
			? ScopeToKeys<T>
			: ScopeToKeys<T>
		: never
>(
	valkeyKeysConfig: T,
	optionalDelimiter?: Delimiter
): ReturnValue => {
	if (optionalDelimiter != null) {
		validateDelimiter(optionalDelimiter);
	}

	const delimiter = optionalDelimiter || ':';

	validateValkeyKeyConfig(valkeyKeysConfig);

	const map: ValkeyKeyTemplatesMapScope = createTemplateScope(
		null,
		valkeyKeysConfig as unknown as ValkeygenConfigScope,
		delimiter
	);

	return map as unknown as ReturnValue;
};
