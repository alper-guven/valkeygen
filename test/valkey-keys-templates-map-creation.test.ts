/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
	generateKey,
	defineKeyParameter,
	createKeysMapping,
	ValkeygenConfig,
} from '../src/index.js';

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
