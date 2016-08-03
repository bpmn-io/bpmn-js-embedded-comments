'use strict';

var commentAuthor = '';

module.exports.setAuthor = function(author) {
	commentAuthor = author;
}

module.exports.getAuthor = function() {
	return commentAuthor;
}