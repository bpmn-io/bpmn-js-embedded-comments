import $ from 'jquery';

import {
  getComments,
  removeComment,
  addComment
} from './util';


/**
 * @typedef { import('./types.js').Comment } Comment
 */


var COMMENT_HTML =
  '<div class="comment">' +
    '<div data-text></div><a href class="delete icon-delete" data-delete></a>' +
  '</div>';


export default function Comments(eventBus, overlays, bpmnjs, translate) {

  var self = this;

  function toggleCollapse(element, collapse) {

    var o = overlays.get({ element: element, type: 'comments' })[0];

    var $overlay = o && o.html;

    if ($overlay) {

      var expanded = typeof collapse !== 'undefined' ? !collapse : $overlay.is('.expanded');

      eventBus.fire('comments.toggle', { element: element, active: !expanded });

      if (expanded) {
        $overlay.removeClass('expanded');
      } else {
        $overlay.addClass('expanded');
        $overlay.find('textarea').focus();
      }
    }
  }

  function createCommentBox(element) {

    var $overlay = $(getOverlayHtml(translate));

    $overlay.find('.toggle').click(function(e) {
      toggleCollapse(element);
    });

    var $commentCount = $overlay.find('[data-comment-count]'),
        $textarea = $overlay.find('textarea'),
        $comments = $overlay.find('.comments');


    function renderComments() {

      // clear innerHTML
      $comments.html('');

      var comments = getComments(element);

      comments.forEach(function(val) {
        var $comment = $(COMMENT_HTML);

        $comment.find('[data-text]').text(val.text);
        $comment.find('[data-delete]').click(function(e) {

          e.preventDefault();

          self.removeComment(element, val);
          renderComments();
          $textarea.val(val.text);
        });

        $comments.append($comment);
      });

      $overlay[comments.length ? 'addClass' : 'removeClass']('with-comments');

      $commentCount.text(comments.length ? ('(' + comments.length + ')') : '');

      eventBus.fire('comments.updated', { comments: comments });
    }

    $textarea.on('keydown', function(e) {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();

        var text = $textarea.val();

        if (text) {

          const comment = {
            author: '',
            text
          };

          self.addComment(element, comment);
          $textarea.val('');
          renderComments();
        }
      }
    });


    // attach an overlay to a node
    overlays.add(element, 'comments', {
      position: {
        bottom: 10,
        right: 10
      },
      html: $overlay
    });

    renderComments();
  }

  eventBus.on('shape.added', function(event) {
    var element = event.element;

    if (element.labelTarget ||
       !element.businessObject.$instanceOf('bpmn:FlowNode')) {

      return;
    }

    defer(function() {
      createCommentBox(element);
    });

  });

  this.collapseAll = function() {

    overlays.get({ type: 'comments' }).forEach(function(c) {
      toggleCollapse(c.element, true);
    });
  };

  this.getComments = function(element) {
    return getComments(element);
  };

  this.addComment = function(element, comment) {
    addComment(element, comment);

    eventBus.fire('comments.added', {
      element: element,
      comment
    });
  };

  this.removeComment = function(element, comment) {
    removeComment(element, comment);

    eventBus.fire('comments.removed', {
      element: element,
      comment: comment
    });
  };

  this.events = {
    ADDED: 'comments.added',
    REMOVED: 'comments.removed',
    UPDATED: 'comments.updated',
    TOGGLED: 'comments.toggled'
  };
}

Comments.$inject = [ 'eventBus', 'overlays', 'bpmnjs', 'translate' ];


// helpers ///////////////

function defer(fn) {
  setTimeout(fn, 0);
}

function getOverlayHtml(translate) {
  return '<div class="comments-overlay">' +
    '<div class="toggle">' +
      '<span class="icon-comment"></span>' +
      '<span class="comment-count" data-comment-count></span>' +
    '</div>' +
    '<div class="content">' +
      '<div class="comments"></div>' +
      '<div class="edit">' +
        `<textarea tabindex="1" placeholder="${translate('Add a comment')}"></textarea>` +
      '</div>' +
    '</div>' +
  '</div>';
}