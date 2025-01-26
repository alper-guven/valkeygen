/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import {
	generateKey,
	defineKeyParameter,
	createKeysMapping,
	ValkeygenConfig,
} from '../src/index.js';
import { IsReadonlyConfig } from '../src/types/key-config.js';

// Type checks as tests
type IsNever<T, K extends [T] extends [never] ? true : false> = [T] extends [
	never
]
	? true
	: false;

type YesOrNo<T, K extends 'yes' extends T ? 'yes' : 'no'> = 'x';

// ? Valid config
const map1 = createKeysMapping({
	SCOPE_FIRST_PART: ['1111'],
	asdlasds: ['asdasd'],
	scope: {
		SCOPE_FIRST_PART: ['2222'],
		asdasd: ['asdasd'],
	},
});
type isValidCFG_1 = IsNever<typeof map1, false>;

// ? Valid config but is not readonly (so it's not valid for the map)
const customObj2 = {
	SCOPE_FIRST_PART: ['1111'],
	qwelxqwe: 'qweqwe',
};
type isReadonly_2 = YesOrNo<IsReadonlyConfig<typeof customObj2>, 'no'>;
// @ts-expect-error : Testing invalid input
const map2 = createKeysMapping(customObj2);

// ? Invalid config (so it's not valid for the map)
const customObj3 = {
	ajkdjkasjkd: 'asdasd',
};
type isReadonly_3 = YesOrNo<IsReadonlyConfig<typeof customObj3>, 'no'>;
// @ts-expect-error : Testing invalid input
const map3 = createKeysMapping(customObj3);

describe('Create Valkey Key', function () {
	describe('Only Key Creator', function () {
		it('should return empty string', function () {
			assert.equal(generateKey('', null), '');
		});

		it('should return test', function () {
			assert.equal(generateKey('test', null), 'test');
		});

		it('should return my:valkey:key:1234', function () {
			assert.equal(
				generateKey('my:valkey:key:%KeyID%', {
					KeyID: '1234',
				}),
				'my:valkey:key:1234'
			);
		});

		it('should throw error when an empty string given as param value', function () {
			expect(() =>
				generateKey('my:valkey:key:%KeyID%', {
					KeyID: '',
				})
			).to.throw(
				'Valkey Key Template String has param named <KeyID>, but given value <> is invalid.'
			);
		});
	});

	describe('Valkey Keys Templates Map Creation', function () {
		it('should throw error when given an empty string as delimiter', function () {
			expect(() =>
				createKeysMapping(
					{
						SCOPE_FIRST_PART: [],

						appStatus: ['app-status'],

						restaurants: {
							SCOPE_FIRST_PART: ['RESTAURANTS'],
							byCategory: ['by-category', defineKeyParameter('CategoryID')],
							byCity: [defineKeyParameter('CityID')],
						},
					},
					''
				)
			).to.throw('Delimiter cannot be empty string');
		});

		it('should throw error when given % as delimiter', function () {
			expect(() =>
				createKeysMapping(
					{
						SCOPE_FIRST_PART: [],

						appStatus: ['app-status'],

						restaurants: {
							SCOPE_FIRST_PART: ['RESTAURANTS'],
							byCategory: ['by-category', defineKeyParameter('CategoryID')],
							byCity: [defineKeyParameter('CityID')],
						},
					},
					'%'
				)
			).to.throw(
				'Invalid delimiter. Delimiter cannot be "%". This is used for params in Valkey Key templates.'
			);
		});

		it('should throw error when given a non string param value as delimiter', function () {
			expect(() =>
				createKeysMapping(
					{
						SCOPE_FIRST_PART: [],

						appStatus: ['app-status'],

						restaurants: {
							SCOPE_FIRST_PART: ['RESTAURANTS'],
							byCategory: ['by-category', defineKeyParameter('CategoryID')],
							byCity: [defineKeyParameter('CityID')],
						},
					},
					// @ts-expect-error : Testing invalid input
					1
				)
			).to.throw('Delimiter must be a string');
		});

		it('should throw error when given an invalid config (invalid prop)', function () {
			const randomObject = {
				SCOPE_FIRST_PART: [],
				asddasd: 'asdasd',
				asdasd: 'asdasd',
				asdasd123123: 1,
			};

			expect(() => {
				// @ts-expect-error : Testing invalid input
				const testRandomObject = createKeysMapping(randomObject);
			}).to.throw('Valkey Key Config is not valid');
		});

		it('should throw error when given an invalid config (no SCOPE_FIRST_PART)', function () {
			const randomObject = {
				key1: ['key1'],
				key2: ['key2'],
			};

			expect(() => {
				// @ts-expect-error : Testing invalid input
				const testRandomObject = createKeysMapping(randomObject);
			}).to.throw(
				'Valkey Key Config is not valid: Config Object itself is not a valid Valkey Key Scope'
			);
		});

		it('should throw error when given an invalid config (invalid SCOPE_FIRST_PART)', function () {
			const randomObject = {
				SCOPE_FIRST_PART: 1,
				key1: ['key1'],
				key2: ['key2'],
			};

			expect(() => {
				// @ts-expect-error : Testing invalid input
				const testRandomObject = createKeysMapping(randomObject);
			}).to.throw(
				'Valkey Key Config is not valid: Valkey Template Array must be an array of strings or Valkey Key Param objects'
			);
		});
	});

	describe('Use Valid Config to Create Key (Without Optional Delimiter)', function () {
		const valkeyKeysMap = createKeysMapping({
			SCOPE_FIRST_PART: [],

			appStatus: ['app-status'],

			restaurants: {
				SCOPE_FIRST_PART: ['RESTAURANTS'],
				byCategory: ['by-category', defineKeyParameter('CategoryID')],
				byCity: [defineKeyParameter('CityID')],
			},

			categories: {
				SCOPE_FIRST_PART: ['categories'],
				byID: [defineKeyParameter('CategoryID')],
			},

			users: {
				SCOPE_FIRST_PART: ['users'],
				online: ['online'],
				withActiveOrder: ['with-active-order'],
				byID: ['by-id', defineKeyParameter('UserID')],
			},

			couriers: {
				SCOPE_FIRST_PART: ['couriers'],
				Online: ['online'],
				OnDelivery: ['on-delivery'],
				byID: {
					SCOPE_FIRST_PART: ['by-id', defineKeyParameter('CourierID')],
					PreviousDeliveries: ['previous-deliveries'],
				},
			},

			orders: {
				SCOPE_FIRST_PART: ['orders'],
				byUser: ['of-user', defineKeyParameter('UserID')],
				byCity: {
					SCOPE_FIRST_PART: ['by-city', defineKeyParameter('CityName')],
					byCourier: ['of-courier', defineKeyParameter('CourierID')],
				},
			},
		});

		it('should return key app-status', function () {
			assert.equal(generateKey(valkeyKeysMap.appStatus, null), 'app-status');
		});

		it('should return key for restaurants by category', function () {
			assert.equal(
				generateKey(valkeyKeysMap.restaurants.byCategory, {
					CategoryID: '1234',
				}),
				'RESTAURANTS:by-category:1234'
			);
		});

		it('should return key for restaurants by city', function () {
			assert.equal(
				generateKey(valkeyKeysMap.restaurants.byCity, {
					CityID: '1234',
				}),
				'RESTAURANTS:1234'
			);
		});

		// previous deliveries of courier with id 1234
		it('should return key for previous deliveries of courier with id 1234', function () {
			assert.equal(
				generateKey(valkeyKeysMap.couriers.byID.PreviousDeliveries, {
					CourierID: '1234',
				}),
				'couriers:by-id:1234:previous-deliveries'
			);
		});

		// orders of user with id 1234
		it('should NOT return key for orders of user with id 1234', function () {
			assert.notEqual(
				generateKey(valkeyKeysMap.orders.byUser, {
					UserID: '1234',
				}),
				'orders:of-user:'
			);
		});
	});

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
});
