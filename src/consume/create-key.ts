import { isParamValueValid } from './validators.js';
import { getRequiredParamsFromTemplateString } from '../types/consumers.js';

const findParamNamesInTemplateString = (templateString: string): string[] => {
	const paramNames: string[] = [];

	const regex = /%([a-zA-Z0-9_]+)%/g;

	// Alternative syntax using RegExp constructor
	// const regex = new RegExp('%([a-zA-Z0-9_]+)%', 'g')

	let m;

	while ((m = regex.exec(templateString)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match) => {
			paramNames.push(match.replace(/%/g, ''));
		});
	}

	return paramNames;
};

// Create a template string from a template array

export function generateKey<T extends string>(
	valkeyKeyTemplateString: T,
	params: getRequiredParamsFromTemplateString<T>
): string {
	// Check if valkeyKeyTemplateString is empty or undefined
	if (valkeyKeyTemplateString == null || valkeyKeyTemplateString === '') {
		throw new Error('Template string can not be empty');
	}

	let newString = String(valkeyKeyTemplateString).toString();

	// Check if template string is empty
	if (newString.length === 0) {
		return '';
	}

	// Check if template string has no params
	if (newString.includes('%') === false) {
		return newString;
	}

	if (params == null) {
		throw new Error(
			'Valkey Key Template String has params, but no params were provided.'
		);
	}

	/**
	 * Good to go.
	 * Replace params in template string with values.
	 */

	const paramsFoundInTemplateString = findParamNamesInTemplateString(newString);

	for (const paramName of paramsFoundInTemplateString) {
		const paramValue = params[paramName];

		if (paramValue == null) {
			throw new Error(
				`Valkey Key Template String has param named <${paramName}>, but no value provided it.`
			);
		}

		if (paramValue === '') {
			throw new Error(
				`Valkey Key Template String has param named <${paramName}>, but given value <${paramValue}> is empty.`
			);
		}

		if (isParamValueValid(paramValue) === false) {
			throw new Error(
				`Valkey Key Template String has param named <${paramName}>, but given value <${paramValue}> is invalid.`
			);
		}

		newString = newString.replace(
			new RegExp(`%${paramName}%`, 'g'),
			paramValue
		);
	}

	return newString;
}
