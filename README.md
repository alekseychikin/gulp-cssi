# gulp-cssi

> Concat css-files to css-file with @import lines

## Getting Started
This plugin requires Gulp.

Install this plugin with this command:

```shell
npm install gulp-cssi --save-dev
```

### Example

```js
var gulp = require('gulp');
var cssi = require('gulp-cssi');

gulp.task('default', function ()
{
  gulp.src([
    '!example/main.css', /* exclude file */
    'example/reset.css', /* put file out of alphabetical turn */
    'example/*.css' /* other files in alphabetical turn */
  ])
    .pipe(cssi('main.css', {prefix: '../'})) /* make prefix to proper path, just for example */
    .pipe(gulp.dest('example'));
});
```

### Options

#### options.prefix
Type: `String`
Default value is empty string

A string value that is used to make prefix to filenames

## license MIT
