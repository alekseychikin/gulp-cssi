'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Concat = require('concat-with-sourcemaps');

module.exports = function (file, opt) {
  if (!file) {
    throw new PluginError('gulp-cssi', 'Missing file option for gulp-concat');
  }
  opt = opt || {};
  if (typeof opt.prefix !== 'string') {
    opt.prefix = '';
  }
  if (typeof opt.concat !== 'boolean') {
    opt.concat = false;
  }
  if (typeof opt.saveEnclosure !== 'number' && typeof opt.saveEnclosure !== 'string') {
    opt.saveEnclosure = 0;
  }

  var firstFile;
  var fileName;

  if (typeof file === 'string') {
    fileName = file;
  }
  else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
    firstFile = new File(file);
  }
  else {
    throw new PluginError('gulp-cssi', 'Missing path in file options for gulp-cssi');
  }

  var fileNames = [];
  var filePath;
  var filePathTmp;
  var fileMap = {};

  function sort(arr, check)
  {
    var t = true;
    var i, len;
    var el;
    while (t) {
      t = false;
      for (i = 0, len = arr.length; i < len - 1; i=i+1) {
        if (check(arr[i], arr[i + 1])) {
          el = arr[i];
          arr.splice(i, 1);
          if (typeof arr[i + 1] === 'undefined') {
            arr.push(el);
          }
          else {
            arr.splice(i + 1, 0, el);
          }
          t = true;
          break;
        }
      }
    }
    return arr;
  }

  function bufferContents(file, enc, cb)
  {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // we dont do streams (yet)
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-concat', 'Streaming not supported'));
      cb();
      return;
    }

    // set first file if not already set
    if (!firstFile) {
      firstFile = file;
    }

    filePath = '';
    if (opt.saveEnclosure > 0) {
      filePathTmp = path.dirname(file.path).split('/');
      filePath += filePathTmp.splice(filePathTmp.length - opt.saveEnclosure, opt.saveEnclosure).join('/') + '/';
    }
    filePath += path.basename(file.path);
    if (fileNames.indexOf(filePath) === -1) {
      fileNames.push(filePath);
      if (opt.concat) {
        fileMap[filePath] = file;
      }
    }

    cb();
  }

  function endStream(cb)
  {
    // no files passed in, no file goes out
    if (!firstFile || !fileNames.length) {
      cb();
      return;
    }

    var mainFile;

    if (typeof file === 'string') {
      mainFile = firstFile.clone({contents: false});
      mainFile.path = path.join(firstFile.base, file);
    }
    else {
      mainFile = firstFile;
    }

    if (opt.prefix.length) {
      fileNames = fileNames.map(function (filename)
      {
        return opt.prefix + filename;
      });
    }

    var filenameA;
    var extA;
    var filenameB;
    var extB;
    fileNames = sort(fileNames, function (a, b)
    {
      extA = path.extname(a);
      filenameA = a.substr(0, a.length - extA.length);
      extB = path.extname(b);
      filenameB = b.substr(0, b.length - extB.length);
      if (filenameA.indexOf(filenameB) === 0) {
        return true;
      }
      return false;
    });

    if (opt.concat) {
      var concat = new Concat(false, fileName, gutil.linefeed);
      fileNames.forEach(function (file)
      {
        file = fileMap[file];
        concat.add(file.relative, file.contents, file.sourceMap);
      });
      mainFile.contents = concat.content;
    }
    else {
      mainFile.contents = new Buffer('@import url("' + fileNames.join('");\n@import url("') + '");\n');
    }


    this.push(mainFile);
    cb();
  }

  return through.obj(bufferContents, endStream);
};
