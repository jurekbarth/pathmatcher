const {
  getBase,
  stripBase,
  getRules,
  checkIfRules,
  getMatchedRules,
  getFirstMatchingRule
} = require('./index');

const rules = require('./rules');

test('getBase of /one/two/three should be /one/two', () => {
  const uri = '/one/two/three'
  expect(getBase(uri)).toBe('/one/two');
});

test('getBase of /a/b/c/d should be /a/b/c', () => {
  const uri = '/a/b/c/d'
  expect(getBase(uri, { baseDepth: 3 })).toBe('/a/b/c');
});

test('getBase of /a should be /a', () => {
  const uri = '/a'
  expect(getBase(uri)).toBe('/a');
});

test('stripBase base: /a/b uri: /a/b/c should be /c', () => {
  const uri = '/a/b/c'
  const base = getBase(uri);
  expect(stripBase(base, uri)).toBe('/c');
});


test('stripBase base: /a/b uri: /a/b/c/d should be /c/d', () => {
  const uri = '/a/b/c/d'
  const base = getBase(uri);
  expect(stripBase(base, uri)).toBe('/c/d');
});



test('checkIfRules base: /a/b uri: /a/b/c/d should be true', () => {
  const uri = '/a/b/c/d'
  const base = getBase(uri);
  expect(checkIfRules(rules, base)).toBe(true);
});

test('getRules base: /a/b uri: /a/b/c/d should be object', () => {
  const uri = '/a/b/c/d'
  const base = getBase(uri);
  expect(getRules(rules, base)).toBe(rules[base]);
});

test('getMatchedRules for: /a/b/c/d', () => {
  const uri = '/a/b/c/d'
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const shouldBe = [{ "allow": true, "groups": ["normal"], "rule": "/**/*" }];
  expect(getMatchedRules(uriRules, strippedUri)).toEqual(shouldBe)
});

test('getMatchedRules for: /a/b/c/d/index.html', () => {
  const uri = '/a/b/c/d/index.html'
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri)
  const uriRules = getRules(rules, base); // returns an object of rules
  const shouldBe = [{ "allow": false, "groups": ["special-group"], "rule": "!/**/index.html" }, { "allow": true, "groups": ["normal"], "rule": "/**/*" }];
  expect(getMatchedRules(uriRules, strippedUri)).toEqual(shouldBe)
});


test('getFirstMatchingRule for: /a/b/c/d/index.html group: just-master', () => {
  const uri = '/a/b/c/d/index.html'
  const groups = ['just-master'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toBeUndefined()
});

test('getFirstMatchingRule for: /a/b/c/d/index.html group: normal', () => {
  const uri = '/a/b/c/d/index.html'
  const groups = ['normal'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": true, "groups": ["normal"], "rule": "/**/*" })
});

test('getFirstMatchingRule for: /a/b/c/d/index.html group: special-group', () => {
  const uri = '/a/b/c/d/index.html'
  const groups = ['special-group'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": false, "groups": ["special-group"], "rule": "!/**/index.html" })
});

test('getFirstMatchingRule for: /a/b/c/d/index.html group: normal, special-group', () => {
  const uri = '/a/b/c/d/index.html'
  const groups = ['normal', 'special-group'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": false, "groups": ["special-group"], "rule": "!/**/index.html" })
});



