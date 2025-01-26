import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import { createKeysMapping } from '../src/index.js';

describe('Valkey Configuration Validation', () => {
	describe('Valid Configurations', () => {
		it('should accept nested valid configuration with arrays', () => {
			const validConfig = {
				SCOPE_PREFIX: ['1111'],
				asdlasds: ['asdasd'],
				scope: {
					SCOPE_PREFIX: ['2222'],
					asdasd: ['asdasd'],
				},
			};

			expect(() => createKeysMapping(validConfig)).to.not.throw();
			const result = createKeysMapping(validConfig);
			assert.isDefined(result.scope);
			assert.isDefined(result.asdlasds);
		});
	});

	describe('Invalid Configurations', () => {
		it('should reject non-array values in configuration', () => {
			const invalidConfig = {
				SCOPE_PREFIX: ['1111'],
				qwelxqwe: 'qweqwe', // Invalid: string instead of array
			};

			expect(() => {
				// @ts-expect-error : Testing invalid input
				createKeysMapping(invalidConfig);
			}).to.throw();
		});

		it('should reject configuration without SCOPE_PREFIX', () => {
			const invalidConfig = {
				ajkdjkasjkd: 'asdasd',
			};

			expect(() => {
				// @ts-expect-error : Testing invalid input
				createKeysMapping(invalidConfig);
			}).to.throw();
		});

		it('should reject configuration with invalid nested structure', () => {
			const invalidNestedConfig = {
				SCOPE_PREFIX: ['1111'],
				scope: {
					// Missing SCOPE_PREFIX in nested scope
					asdasd: ['asdasd'],
				},
			};

			expect(() => {
				// @ts-expect-error : Testing invalid input
				createKeysMapping(invalidNestedConfig);
			}).to.throw();
		});
	});

	describe('Configuration Type Checking', () => {
		it('should validate configuration immutability', () => {
			const config = {
				SCOPE_PREFIX: ['1111'] as const,
				validKey: ['value'] as const,
			} as const;

			// @ts-expect-error : Testing readonly properties
			const result = createKeysMapping(config);
			assert.isDefined(result);

			// Attempting to modify should fail at compile time
			// @ts-expect-error : Testing readonly properties
			result.validKey = ['new value'];
		});
	});
});
