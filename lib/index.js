module.exports = {
  __init__: [ 'comments' ],
  'comments': [ 'type', require('./comments') ],
  'author': require('./author')
};