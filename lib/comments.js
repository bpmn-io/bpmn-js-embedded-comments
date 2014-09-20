'use strict';

var $ = require('jquery');

var _ = require('lodash');


var util = require('./util');


function Comments(eventBus, overlays, bpmnjs) {

  function createCommentBox(element) {

    var $overlay = $('<div class="comments-overlay">' +
      '<div class="toggle">K <span class="comment-count" data-comment-count></span></div>' +
      '<div class="content">' +
        '<div class="comments"></div>' +
        '<div class="edit">' +
          '<textarea></textarea>' +
        '</div>' +
      '</div>' +
    '</div>');

    $overlay.find('.toggle').click(toggle);

    var $commentCount = $overlay.find('[data-comment-count]'),
        $content = $overlay.find('.content'),
        $textarea = $overlay.find('textarea'),
        $comments = $overlay.find('.comments');


    function renderComments() {

      // clear innerHTML
      $comments.html('');

      var comments = util.getComments(element);

      comments.forEach(function(val) {
        var $comment = $('<div class="comment"><div data-text /><a href class="delete" data-delete>&times;</a></div>');

        $comment.find('[data-text]').text(val[1]);
        $comment.find('[data-delete]').click(function(e) {

          e.preventDefault();

          util.removeComment(element, val);
          renderComments();
          $textarea.val(val[1]);
        });

        $comments.append($comment);
      });

      $commentCount.text(comments.length ? ('(' + comments.length + ')') : '');
    }

    function toggle() {
      $overlay.toggleClass('expanded');
    }


    $textarea.on('keydown', function(e) {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();

        var comment = $textarea.val();

        if (comment) {
          util.addComment(element, '', comment);
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

    _.defer(function() {
      createCommentBox(element);
    });

  });
}

module.exports = Comments;