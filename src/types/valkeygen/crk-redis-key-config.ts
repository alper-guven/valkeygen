/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
import { DeepMutable } from '../object-utils';

// * Template array elements

export type ValkeyKeysConfigParam<Name extends string = string> = {
	name: Name;
};

export type ValkeyKeysConfigTemplateArrayElements =
	| string
	| ValkeyKeysConfigParam;

export type ValkeyKeysConfigTemplateArray = Array<
	string | ValkeyKeysConfigParam
>;

// * Redis Key Config

export type ValkeyKeysConfigScope = {
	SCOPE_FIRST_PART: ValkeyKeysConfigTemplateArray;
	[key: string]: ScopeOrKeyTemplate;
};

export type ScopeOrKeyTemplate =
	| ValkeyKeysConfigTemplateArray
	| ValkeyKeysConfigScope;

export type ValkeyKeysConfig = ValkeyKeysConfigScope;

// * Redis Key Config mapped to Redis Key Template String map

export type ValkeyKeyTemplatesMapScope = {
	[key: string]: string | Record<string, string | ValkeyKeyTemplatesMapScope>;
};

// * Redis Key Config validation types

export type IsValidValkeyKeysConfig2<T> =
	DeepMutable<T> extends ValkeyKeysConfig ? true : false;

export type IsReadonlyConfig<T> = 'SCOPE_FIRST_PART' extends keyof T
	? T['SCOPE_FIRST_PART'] extends any[]
		? 'no'
		: 'yes'
	: 'no';
