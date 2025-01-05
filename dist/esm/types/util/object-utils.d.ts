export type Path_GetFirstPart<T> = T extends `${infer First}.${infer Rest}` ? First : T;
export type Path_GetRest<T> = T extends `${infer First}.${infer Rest}` ? Rest : never;
export type JoinStringArray<ArrayToJoin extends readonly string[]> = ArrayToJoin extends readonly [] ? '' : ArrayToJoin extends readonly string[] ? ArrayToJoin extends readonly [infer First, ...infer Rest] ? First extends string ? Rest extends readonly [] ? First : Rest extends readonly string[] ? `${First}:${JoinStringArray<Rest>}` : never : never : never : never;
export type DeepMutable<T> = {
    -readonly [k in keyof T]: DeepMutable<T[k]>;
};
