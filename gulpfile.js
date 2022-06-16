import gulp from "gulp";
import gulpClean from "gulp-clean";
import gulpFileinclude from "gulp-file-include";
import gulpHtmlmin from "gulp-htmlmin";
import gulpSass from "gulp-sass";
import _sass from "sass";

const sass = gulpSass(_sass);
const buildPath = "./build";

const cleanBuild = () =>
  gulp.src(buildPath, { allowEmpty: true })
    .pipe(gulpClean({ force: true }))
gulp.task("cleanBuild", cleanBuild);

const compileScss = () =>
  gulp.src("./src/index.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(gulp.dest(buildPath));
gulp.task("compileScss", compileScss);

const compileHtml = () =>
  gulp.src(["./src/index.html"])
    .pipe(gulpFileinclude({
      prefix: "@@",
      basepath: "@file"
    }))
    .pipe(gulpHtmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(buildPath));
gulp.task("compileHtml", compileHtml);

const copyAssets = () =>
  gulp.src("./src/assets/**/*")
    .pipe(gulp.dest(`${buildPath}/assets`))
gulp.task("copyAssets", copyAssets);

const build = gulp.series(
  cleanBuild,
  gulp.parallel(copyAssets, compileScss, compileHtml)
);
gulp.task("build", build);


const watch = gulp.parallel(
  () => gulp.watch("./src/assets/**/*", copyAssets),
  () => gulp.watch("./src/**/*.scss", compileScss),
  () => gulp.watch("./src/**/*.html", compileHtml),
);
gulp.task("watch", watch);

const start = gulp.series(build, watch);
gulp.task("start", start);
