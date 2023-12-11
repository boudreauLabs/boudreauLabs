"use strict";

const { watch, src, dest, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const cfg = require( './gulp-config.json' );
const paths = cfg.paths;

const isProduction = process.argv.includes('--production');

function scssStyles() {
  return src(paths.styles.in, { allowEmpty: true })
    .pipe(sassGlob())
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded'})).on('error', sass.logError)
    .pipe(gulpIf(isProduction, cleanCss()))
    .pipe(gulpIf(isProduction, rename({ suffix: '.min' })))
    .pipe(gulpIf(!isProduction, sourcemaps.write('.'))) // Writes sourcemaps only in development
    .pipe(dest(paths.styles.out))
    .pipe(browsersync.stream());
}

function themeScript() {
  return gulp.src(paths.scripts.in)
    .pipe(concat(paths.scripts.output_name + '.js'))
    .pipe(gulp.dest(paths.scripts.out))
    .pipe(gulpIf(isProduction, uglify({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })))
    .pipe(gulpIf(isProduction, rename({ suffix: '.min' })))
    .pipe(gulp.dest(paths.scripts.out));
}

function vendorScript() {
  return gulp.src(paths.scripts.vendor.in)
    .pipe(concat(paths.scripts.vendor.output_name + '.js'))
    .pipe(gulp.dest(paths.scripts.vendor.out))
    .pipe(uglify({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.vendor.out));
}

function copyAssets(done) {
  // Misc. root level files
  gulp.src(paths.copy.root)
      .pipe(gulp.dest(paths.dist));

  // Images
  gulp.src(paths.copy.images.in)
      .pipe(gulp.dest(paths.copy.images.out));

  // Files
  gulp.src(paths.copy.files.in)
      .pipe(gulp.dest(paths.copy.files.out));

  // Fonts
  // gulp.src(paths.copy.fonts.in)
  //     .pipe(gulp.dest(paths.copy.fonts.out));

  // Project video files
  // gulp.src(paths.copy.video.in)
  //     .pipe(gulp.dest(paths.copy.video.out));

  done();
}


function clean() {
  return del([paths.clean]);
}

function browserSync(done) {
  browsersync.init( cfg.browserSync.options );
  done();
}

function bsReload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  watch(paths.styles.watch, parallel(scssStyles));
  watch(paths.scripts.watch, themeScript);
};

// Defining complex tasks
const buildSite = gulp.series(copyAssets, themeScript, vendorScript, scssStyles);
const watchProject = gulp.series(buildSite, gulp.parallel(watchFiles, browserSync));


// export tasks
exports.clean = clean;
exports.styles = scssStyles;
exports.build = buildSite;
exports.watch = watchProject;
exports.default = buildSite;
