const mm = require('micromatch');

const getBase = (uri, options = { baseDepth: 2 }) => {
  const uriParts = uri.split('/');
  return uriParts.slice(0, options.baseDepth + 1).join("/");
}

const stripBase = (base, uri) => uri.replace(base, '');

const checkIfRules = (rules, base) => rules.hasOwnProperty(base);

const getRules = (rules, base) => {
  return rules[base];
}

const getMatchedRules = (rules, uri) => {
  const arr = [];
  Object.keys(rules).forEach(rule => {
    if (rule.startsWith('!') && mm.isMatch(uri, rule.substring(1))) {
      arr.push({
        allow: false,
        rule,
        groups: rules[rule],
      })
    }
    if (!rule.startsWith('!') && mm.isMatch(uri, rule)) {
      arr.push({
        allow: true,
        rule,
        groups: rules[rule],
      })
    }
  });
  return arr;
};

const getFirstMatchingRule = (matchedRules, groups) => matchedRules.find(matchedRule => {
  let isGroupMember = false;
  for (let group of groups) {
    if (matchedRule.groups.indexOf(group) != -1) {
      isGroupMember = true;
      break;
    };
  }
  return isGroupMember
});


module.exports = {
  getBase,
  stripBase,
  checkIfRules,
  getRules,
  getMatchedRules,
  getFirstMatchingRule
}
