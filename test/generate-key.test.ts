import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import { generateKey } from '../src/index.js';

describe('Generate Key', function () {
	it('should throw if null', function () {
		// @ts-expect-error : we are testing the error case
		expect(() => generateKey(null, null)).to.throw(
			'Template string can not be empty'
		);
	});

	it('should throw if empty string', function () {
		expect(() => generateKey('', null)).to.throw(
			'Template string can not be empty'
		);
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
			'Valkey Key Template String has param named <KeyID>, but given value <> is empty.'
		);
	});
});
