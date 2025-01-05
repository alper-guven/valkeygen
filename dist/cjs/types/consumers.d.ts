/**
 * * Extract parameters from a Valkey Key Template String
 * * and return an object with the parameters as keys.
 */
export type getRequiredParamsFromTemplateString<T extends string> = T extends `${string}%${infer _ParamName}%${infer _Rest}` ? {
    [K in getValkeyKeyParamsFromTemplateString<T>[number]]: string;
} : null;
export type getValkeyKeyParamsFromTemplateString<T extends string, _D extends number = 10> = T extends `${string}%${infer ParamName}%${infer Rest}` ? [ParamName, ...getValkeyKeyParamsFromTemplateString<Rest>] : [];
