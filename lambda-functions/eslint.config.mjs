const js = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const globals = require('globals');

module.exports = defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node },
      sourceType: "commonjs"
    } 
  },
]);
