var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var runSeq = require('run-sequence');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('build', function () {
    runSeq(['buildJS', 'browserify', 'sass']);
});

gulp.task('default', function(){
  gulp.start('build')

  gulp.watch('www/angular/**', function () {
    runSeq('buildJS', 'browserify', 'sass');
  });

  gulp.watch('scss/**', function () {
    runSeq('buildJS', 'browserify', 'sass');
  });
  gulp.watch('./scss/ionic.app.scss', function(){
    runSeq('sass')
  })

})

gulp.task('buildJS', function () {
    return gulp.src(['./www/angular/app.js', './www/angular/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('built.js'))
        .on('error', function(err){console.log(err)})
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./www/build/'))

});

gulp.task('browserify', ['buildJS'], function(){
    return browserify({
            entries: ['./www/build/built.js']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./www/build/'));
});

gulp.task('browserify', ['buildJS'], function(){
    return browserify({
        entries: ['./www/build/built.js']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./www/build/'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
