var fs = require('fs');

var TestHelper = module.exports = require('bpmn-js/test/helper');

TestHelper.insertCSS('diagram.css', fs.readFileSync('node_modules/diagram-js/assets/diagram.css', 'utf-8'));
TestHelper.insertCSS('comments.css', fs.readFileSync('assets/comments.css', 'utf-8'));

TestHelper.insertCSS('comments-test.css', fs.readFileSync('test/assets/comments-test.css', 'utf-8'));