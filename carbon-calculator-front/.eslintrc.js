module.exports = {
    // ...other configurations
    parser: '@babel/eslint-parser',
    plugins: [
        'react'
    ],
    extends: [
        'plugin:react/recommended',
        // ...any other configurations like 'eslint:recommended'
    ],
    rules: {
        // existing rules
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/react-in-jsx-scope': 'off'
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    // ...
};
  