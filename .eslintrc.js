module.exports = {
  env: {
      browser: true,
      es2021: true
  },
  extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:react-hooks/recommended",
      "plugin:react/recommended"
  ],
  overrides: [
      {
          extends: [
              "xo-typescript"
          ],
          files: [
              "*.ts",
              "*.tsx"
          ],
          rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/restrict-plus-operands": "off",
            "@typescript-eslint/consistent-type-imports": "off",
            "@typescript-eslint/object-curly-spacing": [1, 'always']
          }
      }
  ],
  parserOptions: {
    project: ["tsconfig.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module",
    ecmaFeatures: {
      "jsx": true,
      "tsx": true
    }
  },
  plugins: [
      "react", "react-hooks", "jsx-a11y"
  ],
  ignorePatterns: [".eslintrc.js", "tsdx.config.js", "test", "build", "next.config.js"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/object-curly-spacing": [1, 'always']
  }
}
