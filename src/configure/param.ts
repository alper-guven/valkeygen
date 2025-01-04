import { ValkeygenConfigParam } from '../types/valkeygen/key-config';

export const createValkeyKeyParam = <T extends string>(
	name: T
): ValkeygenConfigParam<T> => {
	return {
		name,
	};
};
