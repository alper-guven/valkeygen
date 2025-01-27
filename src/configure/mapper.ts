import { ScopeToKeys } from '../types/config-mapper.js';
import {
	IsReadonlyConfig,
	IsValidValkeygenConfig2,
	ValkeygenConfig,
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

const createTemplateStringFormTemplateArray = <const Delimiter extends string>(
	templateArray: ValkeygenConfigTemplateArray,
	delimiter: Delimiter
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

const createTemplateLeaf = <const Delimiter extends string>(
	parentTemplateString: string | null,
	leafKeyTemplateArray: ValkeygenConfigTemplateArray,
	delimiter: Delimiter
): string | null => {
	validateValkeyKeyTemplate(leafKeyTemplateArray);

	const templateString = createTemplateStringFormTemplateArray(
		leafKeyTemplateArray,
		delimiter
	);

	if (parentTemplateString != null && parentTemplateString.length > 0) {
		if (templateString) {
			return [parentTemplateString, templateString].join(delimiter);
		}
		return parentTemplateString;
	}

	return templateString;
};

const createTemplateScope = <const Delimiter extends string>(
	parentTemplateString: string | null,
	scope: ValkeygenConfigScope,
	delimiter: Delimiter
): ValkeyKeyTemplatesMapScope => {
	const scopeTemplate: ValkeyKeyTemplatesMapScope = {};

	const scopeFirstPartString = createTemplateStringFormTemplateArray(
		scope.SCOPE_PREFIX,
		delimiter
	);

	for (const [key, value] of Object.entries(scope)) {
		if (key === 'SCOPE_PREFIX') {
			continue;
		}

		let templateString: string | null = null;

		if (parentTemplateString != null && parentTemplateString.length > 0) {
			if (scopeFirstPartString) {
				templateString = [parentTemplateString, scopeFirstPartString].join(
					delimiter
				);
			} else {
				templateString = parentTemplateString;
			}
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

export const createKeysMapping = <
	const T extends ValkeygenConfig,
	const Delimiter extends string = ':',
	K = IsValidValkeygenConfig2<T> extends true ? 'valid' : 'invalid',
	ReturnValue = 'valid' extends K
		? IsReadonlyConfig<T> extends 'yes'
			? ScopeToKeys<T, Delimiter>
			: ScopeToKeys<T, Delimiter>
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
