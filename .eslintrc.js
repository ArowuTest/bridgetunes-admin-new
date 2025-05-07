module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
  },
};
