import { Path_GetFirstPart, Path_GetRest, JoinStringArray } from './util/object-utils';
import { ValkeygenConfigTemplateArrayElements, ValkeygenConfigParam } from './key-config';
/**
 * ! CAUTION:
 * ! Do not remove any export statement on types.
 * ! Otherwise typescript might give an error.
 */
export type ScopeToKeys<T extends Record<string, any>, Delimiter extends string, X extends Record<string, any> = T, AggregatedPath extends string = ''> = 'SCOPE_PREFIX' extends keyof T ? {
    [K in Exclude<keyof T, 'SCOPE_PREFIX'>]: K extends string ? 'SCOPE_PREFIX' extends keyof T[K] ? ScopeToKeys<T[K], Delimiter, X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`> : ValkeyKeyTemplateString_FromPath__Main<X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`, Delimiter> : never;
} : never;
export type ValkeyKeyTemplateString_FromPath__Main<KeyRegistry extends Record<string, any>, Path extends string, Delimiter extends string> = KeyRegistry['SCOPE_PREFIX'] extends readonly any[] ? `${JoinStringArray<KeyRegistry['SCOPE_PREFIX'], Delimiter> extends '' ? '' : `${JoinStringArray<KeyRegistry['SCOPE_PREFIX'], Delimiter>}${Delimiter}`}${ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry, Path, Delimiter> extends '' ? '' : ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry, Path, Delimiter>}` : never;
export type ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry extends Record<string, any>, Path extends string, Delimiter extends string, PathFirst_ObjType = TypeOfPathObject<KeyRegistry, Path_GetFirstPart<Path>>> = PathFirst_ObjType extends 'scope' ? KeyRegistry[Path_GetFirstPart<Path>]['SCOPE_PREFIX'] extends readonly [] ? ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry[Path_GetFirstPart<Path>], Path_GetRest<Path>, Delimiter> : `${Join_ValkeyKeyTemplateArray<KeyRegistry[Path_GetFirstPart<Path>]['SCOPE_PREFIX'], Delimiter>}${ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry[Path_GetFirstPart<Path>], Path_GetRest<Path>, Delimiter> extends '' ? '' : `${Delimiter}${ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry[Path_GetFirstPart<Path>], Path_GetRest<Path>, Delimiter>}`}` : PathFirst_ObjType extends 'leaf' ? KeyRegistry[Path_GetFirstPart<Path>] extends readonly [] ? '' : `${Join_ValkeyKeyTemplateArray<KeyRegistry[Path_GetFirstPart<Path>], Delimiter>}` : never;
/**
 * * Join a Valkey KeyTemplate Array (Array<string | ValkeyKeyParam>) into a string.
 * * This is used to create a Valkey Key Template String.
 */
export type Join_ValkeyKeyTemplateArray<arr extends readonly ValkeygenConfigTemplateArrayElements[], Delimiter extends string> = `${JoinStringArray<ValkeyKeyTemplateArray_ToStringArray<arr>, Delimiter>}`;
export type ValkeyKeyTemplateArray_ToStringArray<T extends readonly ValkeygenConfigTemplateArrayElements[]> = T extends readonly [] ? readonly [] : T extends any ? TailOfArray<T> extends [] ? [makeString_StringOrValkeyKeyParam<T[0]>] : readonly [
    makeString_StringOrValkeyKeyParam<T[0]>,
    ...ValkeyKeyTemplateArray_ToStringArray<TailOfArray<T>>
] : never;
export type TailOfArray<T extends readonly ValkeygenConfigTemplateArrayElements[]> = T extends readonly ValkeygenConfigTemplateArrayElements[] ? T extends readonly [infer _First, ...infer Rest] ? Rest : [] : [];
export type makeString_StringOrValkeyKeyParam<T extends string | ValkeygenConfigParam> = T extends string ? `${T}` : T extends ValkeygenConfigParam ? `%${T['name']}%` : never;
export type TypeOfPathObject<obj, path extends string> = path extends keyof obj ? path extends 'SCOPE_PREFIX' ? 'scope-first-part' : obj[path] extends readonly ValkeygenConfigTemplateArrayElements[] ? 'leaf' : 'scope' : 'not-key';
