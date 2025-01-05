import { ValkeygenConfigParam } from '../types/key-config.js';

export const createValkeyKeyParam = <T extends string>(
	name: T
): ValkeygenConfigParam<T> => {
	return {
		name,
	};
};
