import { Path_GetFirstPart, Path_GetRest, JoinStringArray } from './util/object-utils';
import { ValkeygenConfigTemplateArrayElements, ValkeygenConfigParam } from './key-config';
/**
 * ! CAUTION:
 * ! Do not remove any export statement on types.
 * ! Otherwise typescript might give an error.
 */
export type ScopeToKeys<T extends Record<string, any>, X extends Record<string, any> = T, AggregatedPath extends string = ''> = 'SCOPE_FIRST_PART' extends keyof T ? {
    [K in Exclude<keyof T, 'SCOPE_FIRST_PART'>]: K extends string ? 'SCOPE_FIRST_PART' extends keyof T[K] ? ScopeToKeys<T[K], X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`> : ValkeyKeyTemplateString_FromPath__Main<X, `${AggregatedPath extends '' ? '' : `${AggregatedPath}.`}${K}`> : never;
} : never;
export type ValkeyKeyTemplateString_FromPath__Main<KeyRegistry extends Record<string, any>, Path extends string> = KeyRegistry['SCOPE_FIRST_PART'] extends readonly any[] ? `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']> extends '' ? '' : `${JoinStringArray<KeyRegistry['SCOPE_FIRST_PART']>}:`}${ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry, Path>}` : never;
export type ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry extends Record<string, any>, Path extends string, PathFirst_ObjType = TypeOfPathObject<KeyRegistry, Path_GetFirstPart<Path>>> = PathFirst_ObjType extends 'scope' ? `${Join_ValkeyKeyTemplateArray<KeyRegistry[Path_GetFirstPart<Path>]['SCOPE_FIRST_PART']>}:${ValkeyKeyTemplateString_FromPath__FromScope<KeyRegistry[Path_GetFirstPart<Path>], Path_GetRest<Path>>}` : PathFirst_ObjType extends 'leaf' ? `${Join_ValkeyKeyTemplateArray<KeyRegistry[Path_GetFirstPart<Path>]>}` : never;
/**
 * * Join a Valkey KeyTemplate Array (Array<string | ValkeyKeyParam>) into a string.
 * * This is used to create a Valkey Key Template String.
 */
export type Join_ValkeyKeyTemplateArray<arr extends readonly ValkeygenConfigTemplateArrayElements[]> = `${JoinStringArray<ValkeyKeyTemplateArray_ToStringArray<arr>>}`;
export type ValkeyKeyTemplateArray_ToStringArray<T extends readonly ValkeygenConfigTemplateArrayElements[]> = T extends any ? TailOfArray<T> extends [] ? [makeString_StringOrValkeyKeyParam<T[0]>] : readonly [
    makeString_StringOrValkeyKeyParam<T[0]>,
    ...ValkeyKeyTemplateArray_ToStringArray<TailOfArray<T>>
] : never;
export type TailOfArray<T extends readonly ValkeygenConfigTemplateArrayElements[]> = T extends readonly ValkeygenConfigTemplateArrayElements[] ? T extends readonly [infer _First, ...infer Rest] ? Rest : [] : [];
export type makeString_StringOrValkeyKeyParam<T extends string | ValkeygenConfigParam> = T extends string ? `${T}` : T extends ValkeygenConfigParam ? `%${T['name']}%` : never;
export type TypeOfPathObject<obj, path extends string> = path extends keyof obj ? path extends 'SCOPE_FIRST_PART' ? 'scope-first-part' : obj[path] extends readonly ValkeygenConfigTemplateArrayElements[] ? 'leaf' : 'scope' : 'not-key';
