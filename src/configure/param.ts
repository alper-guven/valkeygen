import { ValkeygenConfigParam } from '../types/key-config.js';

export const defineKeyParameter = <T extends string>(
	name: T
): ValkeygenConfigParam<T> => {
	return {
		name,
	};
};
