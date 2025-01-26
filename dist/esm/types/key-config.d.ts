import { DeepMutable } from './util/object-utils';
export type ValkeygenConfigParam<Name extends string = string> = {
    name: Name;
};
export type ValkeygenConfigTemplateArrayElements = string | ValkeygenConfigParam;
export type ValkeygenConfigTemplateArray = Array<string | ValkeygenConfigParam>;
export type ValkeygenConfigScope = {
    SCOPE_PREFIX: ValkeygenConfigTemplateArray;
    [key: string]: ScopeOrKeyTemplate;
};
export type ScopeOrKeyTemplate = ValkeygenConfigTemplateArray | ValkeygenConfigScope;
export type ValkeygenConfig = ValkeygenConfigScope;
export type ValkeyKeyTemplatesMapScope = {
    [key: string]: string | Record<string, string | ValkeyKeyTemplatesMapScope>;
};
export type IsValidValkeygenConfig2<T> = DeepMutable<T> extends ValkeygenConfig ? true : false;
export type IsReadonlyConfig<T> = 'SCOPE_PREFIX' extends keyof T ? T['SCOPE_PREFIX'] extends any[] ? 'no' : 'yes' : 'no';
