const rules = {
  '/login': 'public',
  '/a/b': {
    "!/**/index.html": [
      "special-group"
    ],
    "/*/resources/js/**/*.private.js": [
      "dev"
    ],
    "/*/resources/js/**": [
      "public"
    ],
    "/master/**": [
      "just-master"
    ],
    "/**/*": [
      "normal"
    ],
  },
};

module.exports = rules;
