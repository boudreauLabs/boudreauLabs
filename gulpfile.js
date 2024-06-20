"use strict";

const { watch, src, dest, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const del = require('del');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const cfg = require( './gulp-config.json' );
const paths = cfg.paths;

const isProduction = process.argv.includes('--production');

function themeScript() {
  return src(paths.scripts.in)
    .pipe(concat(paths.scripts.output_name + '.js'))
    .pipe(dest(paths.scripts.out))
    .pipe(gulpIf(isProduction, uglify({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })))
    .pipe(gulpIf(isProduction, rename({ suffix: '.min' })))
    .pipe(dest(paths.scripts.out));
}

function vendorScript() {
  return src(paths.scripts.vendor.in)
    .pipe(concat(paths.scripts.vendor.output_name + '.js'))
    .pipe(dest(paths.scripts.vendor.out))
    .pipe(uglify({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scripts.vendor.out));
}

function copyAssets(done) {
  // Misc. root level files
  src(paths.copy.root, {encoding: false})
      .pipe(dest(paths.dist));

  // Images
  src(paths.copy.images.in, {encoding: false})
      .pipe(dest(paths.copy.images.out));

  // Files
  src(paths.copy.files.in, {encoding: false})
      .pipe(dest(paths.copy.files.out));

  // Fonts
  // src(paths.copy.fonts.in, {encoding: false})
  //     .pipe(dest(paths.copy.fonts.out));

  // Project video files
  // src(paths.copy.video.in, {encoding: false})
  //     .pipe(dest(paths.copy.video.out));

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
  watch(paths.scripts.watch, themeScript);
};

// Defining complex tasks
const buildSite = series(copyAssets, themeScript, vendorScript);
const watchProject = series(buildSite, parallel(watchFiles, browserSync));


// export tasks
exports.clean = clean;
exports.build = buildSite;
exports.watch = watchProject;
exports.default = buildSite;
