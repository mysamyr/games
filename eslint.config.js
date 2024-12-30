const globals = require("globals");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = [{
  ignores: [
    "node_modules",
    ".husky",
    "assets",
    ".prettierignore",
    ".prettierrc",
  ],
}, ...compat.extends("eslint:recommended", "prettier"), {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    },

    ecmaVersion: 12,
    sourceType: "module",
  },

  rules: {
    "arrow-body-style": ["warn", "as-needed"],
    "no-debugger": "warn",
    "no-duplicate-imports": "error",
    "no-console": "warn",
    "no-undef": "error",
    semi: "error",
    "semi-spacing": "error",
    eqeqeq: "warn",
    "object-shorthand": "error",
    "no-unused-vars": "error",
  },
}];