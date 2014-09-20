module.exports._getCommentsElement = function(element, create) {

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
};

module.exports.getComments = function(element) {
  var doc = this._getCommentsElement(element);

  if (!doc || !doc.text) {
    return [];
  } else {
    return doc.text.split(/;\r?\n;/).map(function(str) {
      return str.split(/:/, 2);
    });
  }
};

module.exports.setComments = function(element, comments) {
  var doc = this._getCommentsElement(element, true);

  var str = comments.map(function(c) {
    return c.join(':');
  }).join(';\n;');

  doc.text = str;
};

module.exports.addComment = function(element, author, str) {
  var comments = this.getComments(element);

  comments.push([ author, str ]);

  this.setComments(element, comments);
};


module.exports.removeComment = function(element, comment) {
  var comments = this.getComments(element);

  var idx = -1;

  comments.some(function(c, i) {

    var matches = c[0] === comment[0] && c[1] === comment[1];

    if (matches) {
      idx = i;
    }

    return matches;
  });

  if (idx !== -1) {
    comments.splice(idx, 1);
  }

  this.setComments(element, comments);
};
