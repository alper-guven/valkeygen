import { ScopeToKeys } from '../types/config-mapper.js';
import { IsReadonlyConfig, IsValidValkeygenConfig2 } from '../types/key-config.js';
export declare const createValkeyKeysMap: <T extends Record<string, any>, Delimiter extends string = ":", K = IsValidValkeygenConfig2<T> extends true ? "valid" : "invalid", ReturnValue = "valid" extends K ? IsReadonlyConfig<T> extends "yes" ? ScopeToKeys<T> : ScopeToKeys<T> : never>(valkeyKeysConfig: T, optionalDelimiter?: Delimiter) => ReturnValue;
