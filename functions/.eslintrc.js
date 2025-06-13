module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // <-- Baris ini yang paling penting
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};