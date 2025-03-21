// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        ignores: ['dist', 'node_modules', 'eslint.config.mjs', 'jest.config.js', 'tsconfig.json', 'tests', '*.test.ts', '.github'],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                // @ts-ignore
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-console': 'off',
            'dot-notation': 'error',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
        },
    },
)
