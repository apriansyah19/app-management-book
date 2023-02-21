import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});

extend("regex", {
  ...rules.regex,
  message: "Password needs to contain 1 lower case, 1 upper case, 1 special character, and min 6 character"
});
