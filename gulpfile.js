var gulp        = require('gulp');
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var imagemin    = require('gulp-imagemin');
var cache       = require('gulp-cache');
var cssnano     = require('gulp-cssnano');
var uglify      = require('gulp-uglify');
var browserify  = require('gulp-browserify');
var concat      = require('gulp-concat');
var cssImport   = require('gulp-import-css');
var sass        = require('gulp-sass');
var purify      = require('gulp-purifycss');
var runSequence = require('run-sequence');
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

var paths    = {
    html: ['*.html', '_layouts/*.html', '_includes/*.html'],
    jekyll: ['_data/*.*', '_config.yml'],
    sass: ['_sass/**/*.scss', '_css/**/*.scss'],
    sass_main: '_css/**/*.scss',
    js: '_js/**/*.js',
    images: '_images/**/*.+(png|jpg|jpeg|gif|svg)',
    dist: '_site'
}
var messages = {
    jekyllBuild: 'jekyll build running'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn(jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Reload browser sync
 */
gulp.task('reload', function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: paths.dist
        }
    });
});

/**
 * Compile and optimize css
 */
gulp.task('sass', function () {
    return gulp.src(paths.sass_main)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.min.css'))
        .pipe(cssImport())
        //.pipe(purify(['*.html', '_layouts/*.html', '_includes/*.html', '_site/js/**/*.js']))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano({
            discardComments: {
                removeAll: true
            },
            colormin: true
        }))
        .pipe(gulp.dest(paths.dist + '/css'))
});

/**
 * Only compresses and prefixes css, jekyll compiles sass
 */
gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(browserify())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + '/js'))
});

/**
 * Minify images, cache already compressed images
 */
gulp.task('images', function(){
  return gulp.src(paths.images)
  .pipe(cache(imagemin()))
  .pipe(gulp.dest(paths.dist + '/img'))
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(paths.js, function() {
        runSequence('js', 'reload');
    });
    gulp.watch(paths.sass, function() {
        runSequence('sass', 'reload');
    });
    gulp.watch([paths.html, paths.jekyll], function() {
        runSequence('jekyll-build', ['js', 'sass'], 'reload');
    });
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', function() {
    runSequence('jekyll-build', ['images', 'js', 'sass','browser-sync'], 'watch');
});