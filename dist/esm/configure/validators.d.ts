import { ValkeygenConfigParam, ValkeygenConfigScope, ValkeygenConfigTemplateArray, ScopeOrKeyTemplate } from '../types/key-config.js';
export declare const isValkeyKeyParam: (templateMember: string | ValkeygenConfigParam) => templateMember is ValkeygenConfigParam;
export declare const isValkeyKeyTemplate: (possibleTemplate: ScopeOrKeyTemplate) => possibleTemplate is ValkeygenConfigTemplateArray;
export declare const validateValkeyKeyTemplate: (possibleTemplate: ScopeOrKeyTemplate) => void;
export declare const isScopeLike: (possibleScope: unknown) => possibleScope is ValkeygenConfigScope;
export declare const isValidScope: (scope: unknown) => scope is ValkeygenConfigScope;
export declare const validateScope: (scope: unknown, parentPath: string | null) => void;
export declare const validateValkeyKeyConfig: (valkeyKeyConfig: unknown) => void;
export declare const validateDelimiter: (delimiter: unknown) => void;
