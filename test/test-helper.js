var fs = require('fs');

var TestHelper = module.exports = require('bpmn-js/test/helper');

TestHelper.insertCSS('diagram-js.css', fs.readFileSync('node_modules/diagram-js/assets/diagram-js.css', 'utf8'));
TestHelper.insertCSS('comments.css', fs.readFileSync('assets/comments.css', 'utf8'));

TestHelper.insertCSS('comments-test.css', fs.readFileSync('test/assets/comments-test.css', 'utf8'));