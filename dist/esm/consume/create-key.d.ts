import { getRequiredParamsFromTemplateString } from '../types/consumers.js';
export declare function createValkeyKey<T extends string>(valkeyKeyTemplateString: T, params: getRequiredParamsFromTemplateString<T>): string;
