const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                process: "readonly",
                console: "readonly",
                module: "readonly",
                require: "readonly",
                jest: "readonly",
                describe: "readonly",
                it: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                expect: "readonly"
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "semi": ["error", "always"]
        }
    }
];
