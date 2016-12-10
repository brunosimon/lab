var gulp        = require('gulp')
var browserify  = require('browserify')
var babelify    = require('babelify')
var source      = require('vinyl-source-stream')
var buffer      = require('vinyl-buffer')
var uglify      = require('gulp-uglify')
var sourcemaps  = require('gulp-sourcemaps')


gulp.task( 'build', function()
{
    return browserify( {
            entries: '../sources/javascript/index.js',
            debug  : true
        })
        .transform( 'babelify', { presets: [ 'babel-preset-es2015' ].map( require.resolve ) } )
        .bundle()
        .pipe( source( 'bundle.js' ) )
        .pipe( buffer() )
        .pipe( sourcemaps.init() )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './maps' ) )
        .pipe( gulp.dest( '../' ) )
})

gulp.task( 'watch', [ 'build' ], function()
{
    gulp.watch( '../sources/javascript/**', [ 'build' ] )
} )

gulp.task( 'default', [ 'watch' ] )
