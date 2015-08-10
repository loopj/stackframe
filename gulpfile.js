var coveralls = require('gulp-coveralls');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var sources = 'stackframe.js';
var minified = sources.replace('.js', '.min.js');

gulp.task('lint', function () {
    return gulp.src(sources)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('test-ci', ['copy', 'dist'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.ci.js',
        singleRun: true
    }, done);
});

gulp.task('copy', function () {
    gulp.src(sources)
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', function() {
    return gulp.src(sources)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename(minified))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['build', 'coverage', 'dist']));

gulp.task('ci', ['lint', 'test-ci'], function () {
    gulp.src('./coverage/Chrome*/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['clean'], function (cb) {
    runSequence('lint', ['copy', 'dist'], 'test', cb);
});
