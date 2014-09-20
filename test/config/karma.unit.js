module.exports = function(karma) {
  karma.set({

    basePath: '../../',

    frameworks: [ 'browserify', 'mocha', 'chai' ],

    files: [
      'test/integration/**/*.js'
    ],

    preprocessors: {
      'test/integration/**/*.js': [ 'browserify' ]
    },

    reporters: [ 'progress' ],

    browsers: [ 'PhantomJS' ],

    singleRun: false,
    autoWatch: true,

    // browserify configuration
    browserify: {
      transform: [ 'brfs' ],
      debug: true
    }
  });
};
