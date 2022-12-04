const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const feather = require('feather-icons');

//scss to css
function style() {
  return gulp.src('public/assets/scss/**/*.scss', {
    sourcemaps: true
  })
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/assets/css', {
      sourcemaps: '.'
    }))
    .pipe(browserSync.reload({
      stream: true
    }));
}
gulp



// Watch function
function watch() {
  browserSync.init({
    proxy: "localhost/multikart-2021/back-end/index.html",
  });
  gulp.watch("public/assets/scss/**/*.scss", style);
  gulp.watch("**/*.html").on("change", browserSync.reload);
  gulp.watch("public/assets/css/*.css").on("change", browserSync.reload);
}

exports.style = style;
exports.watch = watch;

const build = gulp.series(watch);
gulp.task("default", build, "browser-sync");