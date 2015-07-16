'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

module.exports = function (file, opt) {
  if (!file) {
    throw new PluginError('gulp-cssi', 'Missing file option for gulp-concat');
  }
  opt = opt || {};
  if (typeof opt.prefix !== 'string') {
    opt.prefix = '';
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
    fileNames.push(filePath);

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

    mainFile.contents = new Buffer('@import url("' + fileNames.join('");\n@import url("') + '");\n');

    this.push(mainFile);
    cb();
  }

  return through.obj(bufferContents, endStream);
};
