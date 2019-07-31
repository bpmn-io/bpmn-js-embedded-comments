import {
  insertCSS
} from 'bpmn-js/test/helper';

insertCSS('diagram-js.css', require('bpmn-js/dist/assets/diagram-js.css'));
insertCSS('comments.css', require('../assets/comments.css'));

insertCSS('comments-test.css', require('./assets/comments-test.css'));

export * from 'bpmn-js/test/helper';