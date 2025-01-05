import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		languageOptions: {
			parser: tsParser,
		},
		rules: {
			eqeqeq: ['error', 'always', { null: 'ignore' }],
			'no-console': 'error',
			...tsPlugin.configs['recommended'].rules,
		},
	},
];
