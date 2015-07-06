var gulp = require('gulp');
var cssi = require('./index');

gulp.task('default', function ()
{
  gulp.src([
    '!example/main.css',
    'example/reset.css',
    'example/*.css'
  ])
    .pipe(cssi('main.css', {prefix: '../'}))
    .pipe(gulp.dest('example'));
});
