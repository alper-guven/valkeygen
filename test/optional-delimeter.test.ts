import { assert } from 'chai';
import { describe, it } from 'mocha';
import { defineKeyParameter } from '../src/configure/param.js';
import { createKeysMapping } from '../src/configure/mapper.js';
import { generateKey } from '../src/consume/create-key.js';

describe('Use Valid Config to Create Key (With Optional Delimiter)', function () {
	it('should return key for restaurants by category with given delimiter (.)', function () {
		const valkeyKeysMap_WithCustomDelimiter = createKeysMapping(
			{
				SCOPE_FIRST_PART: [],

				appStatus: ['app-status'],

				restaurants: {
					SCOPE_FIRST_PART: ['RESTAURANTS'],
					byCategory: ['by-category', defineKeyParameter('CategoryID')],
					byCity: [defineKeyParameter('CityID')],
				},
			},
			'.'
		);

		assert.equal(
			generateKey(valkeyKeysMap_WithCustomDelimiter.restaurants.byCategory, {
				CategoryID: '1234',
			}),
			'RESTAURANTS.by-category.1234'
		);
	});
});
