import '../test-helper';

import Viewer from 'bpmn-js/lib/Viewer';

import commentsModule from '../../lib';

import {
  addComment
} from '../../lib/util';


describe('comments integration', function() {

  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });


  this.timeout(5000);


  it('should open viewer with comments extension', function(done) {

    // given
    var viewer = new Viewer({
      container: container,
      additionalModules: [
        commentsModule
      ]
    });

    var xml = require('./fixtures/bpmn/simple-with-comments.bpmn');


    // when
    viewer.importXML(xml, function(err) {

      if (err) {
        return done(err);
      }

      defer(function() {
        var overlays = viewer.get('overlays');

        var overlay = overlays.get({ element: 'Task_1', type: 'comments' })[0];

        var text = overlay.html.text();

        expect(text).to.contain('(2)');
        expect(text).to.contain('LINEBREAK');
        expect(text).to.contain('TEST');

        done();
      });
    });
  });


  it('should serialize with new comment', function(done) {

    // given
    var viewer = new Viewer({
      container: container,
      additionalModules: [
        commentsModule
      ]
    });

    var xml = require('./fixtures/bpmn/simple.bpmn');


    // when
    viewer.importXML(xml, function(err) {

      if (err) {
        return done(err);
      }

      var elementRegistry = viewer.get('elementRegistry');

      var subProcess = elementRegistry.get('SubProcess_1');

      addComment(subProcess, '', 'This is a subprocess');
      addComment(subProcess, 'ME', 'This is another comment\n(with line breaks)');

      var expectedXML =
        '<bpmn2:subProcess id="SubProcess_1" name="Sub Process 1">' +
          '<bpmn2:documentation textFormat="text/x-comments">' +
            '<![CDATA[' +
            ':This is a subprocess;\n' +
            ';ME:This is another comment\n' +
            '(with line breaks)' +
            ']]>' +
          '</bpmn2:documentation>'; // ...

      viewer.saveXML(function(err, xml) {

        if (err) {
          return done(err);
        }

        expect(xml).to.contain(expectedXML);

        done(err);
      });
    });
  });

});


// helpers ///////////////

function defer(fn) {
  setTimeout(fn, 0);
}