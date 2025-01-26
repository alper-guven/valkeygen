import { assert } from 'chai';
import { describe, it } from 'mocha';
import {
	generateKey,
	defineKeyParameter,
	createKeysMapping,
} from '../src/index.js';

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
