var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    connect = require("gulp-connect"),
    browserify = require("gulp-browserify"),
    reactify = require("reactify"),
    es6ify = require("es6ify"),
    stylus = require("gulp-stylus"),
    autoprefixer = require("gulp-autoprefixer"),
    cssmin = require("gulp-cssmin"),
    haml = require("gulp-haml"),
    prettify = require("gulp-html-prettify"),
    markdown = require("gulp-markdown"),
    plumber = require("gulp-plumber");

gulp.task("js", function() {
  gulp.src("src/*.js")
      .pipe(plumber())
      .pipe(browserify({
        transform: ["reactify", "es6ify"],
        add: es6ify.runtime
      }))
      .pipe(uglify())
      .pipe(gulp.dest("build"))
      .pipe(connect.reload())
});

gulp.task("stylus", function() {
  gulp.src("src/*.styl")
      .pipe(plumber())
      .pipe(stylus({use: ["nib"]}))
      .pipe(autoprefixer())
      .pipe(cssmin())
      .pipe(gulp.dest("build"))
      .pipe(connect.reload());
});

gulp.task("haml", function() {
  gulp.src("src/**/*.haml")
      .pipe(plumber())
      .pipe(haml())
      .pipe(prettify({indent_char: " ", indent_size: 2}))
      .pipe(gulp.dest("build"))
      .pipe(connect.reload());
});

gulp.task("markdown", function() {
  gulp.src("src/**/*.md")
      .pipe(plumber())
      .pipe(markdown({gfm: true, tables: true, breaks: true, smartypants: true}))
      .pipe(gulp.dest("build"))
      .pipe(connect.reload());
});

gulp.task("connect", connect.server({
  root: ["build"],
  port: 5678,
  livereload: true
}));

gulp.task("watch", function() {
  gulp.watch(["src/**/*.haml"], ["haml"]);
  gulp.watch(["src/**/*.js"], ["js"]);
  gulp.watch(["src/**/*.styl"], ["stylus"]);
  gulp.watch(["src/**/*.md"], ["markdown"]);
});

gulp.task("build", ["haml", "stylus", "js", "markdown"]);

gulp.task("default", ["build", "connect", "watch"]);
