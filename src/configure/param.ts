import { ValkeyKeysConfigParam } from '../types/valkeygen/key-config';

export const createValkeyKeyParam = <T extends string>(
	name: T
): ValkeyKeysConfigParam<T> => {
	return {
		name,
	};
};
