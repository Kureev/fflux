'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var sourceFile = './index.js';
var destFile = 'fflux.js';
var destFolder = './dist/';

gulp.task('browserify', function() {
    return browserify(sourceFile)
        .bundle()
        .pipe(source(destFile))
        .pipe(gulp.dest(destFolder));
});

gulp.task('default', ['browserify'], function() {
    gulp.src('./dist/*.js')
        .pipe(uglify())
        .pipe(rename('fflux.min.js'))
        .pipe(gulp.dest(destFolder));
});