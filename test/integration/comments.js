// insert css
require('../TestHelper');

var fs = require('fs');


var Viewer = require('bpmn-js/lib/Viewer');


var _ = require('lodash');

var commentsModule = require('../../');

var CommentsUtil = require('../../lib/util');


describe('comments integration', function() {

  var container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });


  this.timeout(5000);


  it('should open viewer with comments extension', function(done) {

    // given
    var viewer = new Viewer({ container: container, additionalModules: [
      commentsModule
    ]});

    var xml = fs.readFileSync('test/fixtures/bpmn/simple-with-comments.bpmn', 'utf-8');


    // when
    viewer.importXML(xml, function(err) {

      if (err) {
        return done(err);
      }

      _.defer(function() {
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
    var viewer = new Viewer({ container: container, additionalModules: [
      commentsModule
    ]});

    var xml = fs.readFileSync('test/fixtures/bpmn/simple.bpmn', 'utf-8');


    // when
    viewer.importXML(xml, function(err) {

      if (err) {
        return done(err);
      }

      var elementRegistry = viewer.get('elementRegistry');

      var subProcess = elementRegistry.getById('SubProcess_1');

      CommentsUtil.addComment(subProcess, '', 'This is a subprocess');
      CommentsUtil.addComment(subProcess, 'ME', 'This is another comment\n(with line breaks)');

      var expectedXML =
        '<bpmn2:subProcess id="SubProcess_1" name="Sub Process 1">' +
          '<bpmn2:documentation textFormat="text/x-comments">' +
            ':This is a subprocess;\n' +
            ';ME:This is another comment\n' +
            '(with line breaks)' +
          '</bpmn2:documentation>'; // ...

      viewer.saveXML(function(err, xml) {
        expect(xml).to.contain(expectedXML);

        done(err);
      });
    });
  });

});