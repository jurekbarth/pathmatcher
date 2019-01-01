const {
  getBase,
  stripBase,
  getRules,
  checkIfRules,
  getMatchedRules,
  getFirstMatchingRule,
  getGroupsForUri
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
  const shouldBe = [{ "allow": true, "rule": "/**/*", "triggers": { "groups": ["p1--client-view", "dev"] } }];
  expect(getMatchedRules(uriRules, strippedUri)).toEqual(shouldBe)
});

test('getMatchedRules for: /a/b/c/d/index.html', () => {
  const uri = '/a/b/c/d/index.html'
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri)
  const uriRules = getRules(rules, base); // returns an object of rules
  const shouldBe = [{ "allow": false, "rule": "!/**/index.html", "triggers": { "groups": ["p1--client-view-c-level"] } }, { "allow": true, "rule": "/**/*", "triggers": { "groups": ["p1--client-view", "dev"] } }];
  expect(getMatchedRules(uriRules, strippedUri)).toEqual(shouldBe)
});


test('getFirstMatchingRule for: /a/b/c/d/index.html group: other-group', () => {
  const uri = '/a/b/c/d/index.html'
  const groups = ['other-group'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toBeUndefined()
});

test('getFirstMatchingRule for: /a/b/c/d/index.html group: p1--client-view', () => {
  const uri = '/a/b/c/d/index.html'
  const groups = ['p1--client-view'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": true, "rule": "/**/*", "triggers": { "groups": ["p1--client-view", "dev"] } })
});

test('getFirstMatchingRule for: /a/b/master/d/index.html group: p1--client-view-c-level', () => {
  const uri = '/a/b/master/d/index.html'
  const groups = ['p1--client-view-c-level'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": true, "rule": "/master/**", "triggers": { "groups": ["p1--client-view-c-level"] } })
});

test('getFirstMatchingRule for: /a/b/c/d/index.html group: p1--client-view-c-level, p1--client-view', () => {
  const uri = '/a/b/c/d/index.html'
  const groups = ['p1--client-view-c-level', 'p1--client-view'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": false, "rule": "!/**/index.html", "triggers": { "groups": ["p1--client-view-c-level"] } })
});

test('getFirstMatchingRule for: /a/b/c/d/somepage.html group: p1--client-view-c-level, p1--client-view', () => {
  const uri = '/a/b/c/d/somepage.html'
  const groups = ['p1--client-view-c-level', 'p1--client-view'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": true, "rule": "/**/*", "triggers": { "groups": ["p1--client-view", "dev"] } })
});

test('getFirstMatchingRule for: /a/b/master/d/index.html group: p1--client-view-c-level, p1--client-view', () => {
  const uri = '/a/b/master/d/index.html'
  const groups = ['p1--client-view-c-level', 'p1--client-view'];
  const base = getBase(uri); // /a/b
  const strippedUri = stripBase(base, uri);
  const uriRules = getRules(rules, base); // returns an object of rules
  const matchingRules = getMatchedRules(uriRules, strippedUri);
  expect(getFirstMatchingRule(matchingRules, groups)).toEqual({ "allow": true, "rule": "/master/**", "triggers": { "groups": ["p1--client-view-c-level"] } })
});


test('getGroupsForUri for: /a/b/master/d/index.html group: p1--client-view-c-level, p1--client-view', () => {
  const uri = '/a/b/master/d/index.html'
  const groups = ['p1--client-view-c-level', 'p1--client-view'];
  expect(getGroupsForUri(uri, rules, groups)).toEqual(["p1--client-view-c-level"])
});





