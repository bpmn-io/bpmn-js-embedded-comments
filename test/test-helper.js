import {
  insertCSS
} from 'bpmn-js/test/helper';

insertCSS('diagram-js.css', require('bpmn-js/dist/assets/diagram-js.css'));
insertCSS('comments.css', require('../assets/comments.css'));

insertCSS('comments-test.css', require('./assets/comments-test.css'));

insertCSS('test.css', '.test-container { height: 80vh; width: 80vw; border: solid #CACACA 3px; margin: 10px 0; }');

export * from 'bpmn-js/test/helper';