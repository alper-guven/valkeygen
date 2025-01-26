/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepMutable } from './util/object-utils';

// * Template array elements

export type ValkeygenConfigParam<Name extends string = string> = {
	name: Name;
};

export type ValkeygenConfigTemplateArrayElements =
	| string
	| ValkeygenConfigParam;

export type ValkeygenConfigTemplateArray = Array<string | ValkeygenConfigParam>;

// * Valkey Key Config

export type ValkeygenConfigScope = {
	SCOPE_PREFIX: ValkeygenConfigTemplateArray;
	[key: string]: ScopeOrKeyTemplate;
};

export type ScopeOrKeyTemplate =
	| ValkeygenConfigTemplateArray
	| ValkeygenConfigScope;

export type ValkeygenConfig = ValkeygenConfigScope;

// * Valkey Key Config mapped to Valkey Key Template String map

export type ValkeyKeyTemplatesMapScope = {
	[key: string]: string | Record<string, string | ValkeyKeyTemplatesMapScope>;
};

// * Valkey Key Config validation types

export type IsValidValkeygenConfig2<T> = DeepMutable<T> extends ValkeygenConfig
	? true
	: false;

export type IsReadonlyConfig<T> = 'SCOPE_PREFIX' extends keyof T
	? T['SCOPE_PREFIX'] extends any[]
		? 'no'
		: 'yes'
	: 'no';
