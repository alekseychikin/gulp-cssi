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

#### options.saveEnclosure
Type: `UInt`
Default value is `0`

If path of your css-file is `/Applications/MAMP/htdocs/localhost/components/menu/menu.css` and you want to get `import url("menu/menu.css");` then you need one more enclosure. So you set `saveEnclosure: 1`. And you may set `saveEnclosure: 2` to get `components/menu/menu.css` piece of path.

## license MIT
