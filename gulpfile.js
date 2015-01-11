'use strict';

var gulp = require('gulp');
var gReact = require('gulp-react');
var gReplace = require('gulp-replace');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');
var browserifyConfig = {
    entries: ['./index.js'],
    standalone: 'FFlux'
};

gulp.task('clean', function(cb) {
    del(['lib/', 'fflux.js'], cb);
});

gulp.task('lib', function() {
    return gulp.src('src/*.js')
        .pipe(gReact({
            harmony: true
        }))
        .pipe(gReplace(/__DEV__/g, 'false'))
        .pipe(gulp.dest('lib'));
});

gulp.task('browserify', function() {
    return browserify(browserifyConfig)
        .bundle()
        .pipe(source('fflux.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('publish', ['clean', 'default']);
gulp.task('default', ['lib', 'browserify']);