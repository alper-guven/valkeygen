import { getRequiredParamsFromTemplateString } from '../types/consumers.js';
export declare function generateKey<T extends string>(valkeyKeyTemplateString: T, params: getRequiredParamsFromTemplateString<T>): string;
