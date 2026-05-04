/**
 * @typedef { import('./types.js').Comment } Comment
 */


export function _getCommentsElement(element, create) {

  var bo = element.businessObject;

  var docs = bo.get('documentation');

  var comments;

  // get comments node
  docs.some(function(d) {
    return d.textFormat === 'text/x-comments' && (comments = d);
  });

  // create if not existing
  if (!comments && create) {
    comments = bo.$model.create('bpmn:Documentation', { textFormat: 'text/x-comments' });
    docs.push(comments);
  }

  return comments;
}

/**
 * @param {DiagramElement} element
 *
 * @return {Comment[]} comments
 */
export function getComments(element) {
  var doc = _getCommentsElement(element);

  if (!doc || !doc.text) {
    return [];
  } else {
    return doc.text.split(/;\r?\n;/).map(function(str) {
      return str.split(/:/, 2);
    }).map(([ author, text ]) => ({ author, text }));
  }
}

/**
 * @param {DiagramElement} element
 * @param {Comment[]} comments
 */
export function setComments(element, comments) {
  var doc = _getCommentsElement(element, true);

  var str = comments.map(function(c) {
    return [ c.author, c.text ].join(':');
  }).join(';\n;');

  doc.text = str;
}

/**
 * @param {DiagramElement} element
 * @param {Comment} comment
 */
export function addComment(element, comment) {
  var comments = getComments(element);

  comments.push(comment);

  setComments(element, comments);
}

/**
 * @param {DiagramElement} element
 * @param {Comment} comment
 */
export function removeComment(element, comment) {
  var comments = getComments(element);

  var idx = comments.findIndex(c => {
    return (
      c.author === comment.author && c.text === comment.text
    );
  });

  if (idx !== -1) {
    comments.splice(idx, 1);
  }

  setComments(element, comments);
}