import { ScopeToKeys } from '../types/config-mapper.js';
import { IsReadonlyConfig, IsValidValkeygenConfig2, ValkeygenConfig } from '../types/key-config.js';
export declare const createKeysMapping: <const T extends ValkeygenConfig, const Delimiter extends string = ":", K = IsValidValkeygenConfig2<T> extends true ? "valid" : "invalid", ReturnValue = "valid" extends K ? IsReadonlyConfig<T> extends "yes" ? ScopeToKeys<T, Delimiter> : ScopeToKeys<T, Delimiter> : never>(valkeyKeysConfig: T, optionalDelimiter?: Delimiter) => ReturnValue;
