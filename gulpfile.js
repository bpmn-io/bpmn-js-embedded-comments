var gulp = require('gulp');
var webpack = require('webpack-stream'),
	WEBPACK_CONFIG = require("./webpack.config.js");

gulp.task('webpack', function() {
  return gulp.src('lib/index.js')
    .pipe(webpack( WEBPACK_CONFIG ))
    .pipe(gulp.dest('dist/'));
});