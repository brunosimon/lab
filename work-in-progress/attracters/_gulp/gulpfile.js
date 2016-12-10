var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    coffee     = require('gulp-coffee'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    watch      = require('gulp-watch'),
    minify_css = require('gulp-minify-css');

var path = '../src/';

/**
 * JS
 */
gulp.task('js', function()
{
    gulp.src([
        path + 'js/canvas.js',
        path + 'js/attraction.js',
        path + 'js/particle.js',
        path + 'js/script.js',
    ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path + 'js/'));
});

gulp.task('coffee', function() {
 gulp.src(path + 'coffee/*.coffee')
   .pipe(coffee({bare: true}).on('error', gutil.log))
   .pipe(gulp.dest(path + 'js/'));
});

/**
 * CSS
 */
gulp.task('css', function()
{
    gulp.src([
            path + 'css/reset.css',
            path + 'css/style.css'
        ])
        .pipe(concat(project + '.min.css'))
        .pipe(minify_css())
        .pipe(gulp.dest(path + 'css/'));
});

/**
 * WATCH
 */
gulp.task('watch',function()
{
    gulp.watch([path + 'coffee/*.coffee'],['coffee']);
    gulp.watch([path + 'js/*.js'],['js']);

    // gulp.src([path + 'js/**.css'])
    //     .pipe(watch(function(files)
    //     {
    //         return gulp.run('css');
    //     }));
});


gulp.task('default',['coffee','js','css']);
