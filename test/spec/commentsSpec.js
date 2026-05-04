import { expect } from 'chai';

import '../test-helper';

import Viewer from 'bpmn-js/lib/Viewer';

import commentsModule from '../../lib';

import {
  addComment
} from '../../lib/util';


describe('comments integration', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    container.classList.add('test-container');
    document.body.appendChild(container);
  });


  this.timeout(5000);


  it('should open viewer with comments extension', async function() {

    // given
    const viewer = new Viewer({
      container: container,
      additionalModules: [
        commentsModule
      ]
    });

    const xml = require('./simple-with-comments.bpmn');


    // when
    await viewer.importXML(xml);

    await defer();

    const overlays = viewer.get('overlays');

    const overlay = overlays.get({ element: 'Task_1', type: 'comments' })[0];

    const text = overlay.html.text();

    expect(text).to.contain('(2)');
    expect(text).to.contain('LINEBREAK');
    expect(text).to.contain('TEST');
  });


  it('should serialize with new comment', async function() {

    // given
    const viewer = new Viewer({
      container: container,
      additionalModules: [
        commentsModule
      ]
    });

    const xml = require('./simple.bpmn');


    // when
    await viewer.importXML(xml);

    await defer();

    const elementRegistry = viewer.get('elementRegistry');

    const subProcess = elementRegistry.get('SubProcess_1');

    addComment(subProcess, '', 'This is a subprocess');
    addComment(subProcess, 'ME', 'This is another comment\n(with line breaks)');

    const expectedXML =
      '<bpmn2:subProcess id="SubProcess_1" name="Sub Process 1">' +
        '<bpmn2:documentation textFormat="text/x-comments">' +
          ':This is a subprocess;\n' +
          ';ME:This is another comment\n' +
          '(with line breaks)' +
        '</bpmn2:documentation>'; // ...

    const { xml: savedXML } = await viewer.saveXML();

    expect(savedXML).to.contain(expectedXML);

  });

  it('should expose comments API via DI', async function() {

    const viewer = new Viewer({
      container: container,
      additionalModules: [ commentsModule ]
    });

    const xml = require('./simple.bpmn');

    await viewer.importXML(xml);

    const comments = viewer.get('comments');
    const elementRegistry = viewer.get('elementRegistry');

    const task = elementRegistry.get('Task_1');

    comments.addComment(task, 'Drin', 'Hello');

    const result = comments.getComments(task);

    expect(result.length).to.equal(1);
    expect(result[0][1]).to.equal('Hello');
  });

  it('should fire comments.added event', async function() {

    const viewer = new Viewer({
      container: container,
      additionalModules: [ commentsModule ]
    });

    const xml = require('./simple.bpmn');

    await viewer.importXML(xml);

    const eventBus = viewer.get('eventBus');
    const comments = viewer.get('comments');
    const elementRegistry = viewer.get('elementRegistry');

    const task = elementRegistry.get('Task_1');

    let fired = false;

    eventBus.on('comments.added', function(e) {
      fired = true;
      expect(e.element).to.equal(task);
    });

    comments.addComment(task, 'Drin', 'Test');

    expect(fired).to.be.true;
  });

  it('should fire comments.removed event', async function() {

    const viewer = new Viewer({
      container: container,
      additionalModules: [ commentsModule ]
    });

    const xml = require('./simple.bpmn');

    await viewer.importXML(xml);

    const eventBus = viewer.get('eventBus');
    const comments = viewer.get('comments');
    const elementRegistry = viewer.get('elementRegistry');

    const task = elementRegistry.get('Task_1');

    comments.addComment(task, '', 'To delete');

    const existing = comments.getComments(task)[0];

    let fired = false;

    eventBus.on('comments.removed', function() {
      fired = true;
    });

    comments.removeComment(task, existing);

    expect(fired).to.be.true;
  });
});

// helpers ///////////////

function defer(fn) {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}