// * Export Type Definitions
export {
	ValkeygenConfigParam,
	ValkeygenConfigScope,
	ValkeygenConfigTemplateArray,
	ValkeygenConfig,
} from './types/key-config.js';

// * Export Configure Functions
export { createKeysMapping } from './configure/mapper.js';
export { defineKeyParameter } from './configure/param.js';

// * Export Consuming Functions
export { generateKey } from './consume/create-key.js';
