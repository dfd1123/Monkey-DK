const eslintConfig = require('../.eslintrc.js');

module.exports = {
    ...eslintConfig,
    parserOptions: {
        ...eslintConfig.parserOptions,
        project: './tsconfig.json'
    }
};