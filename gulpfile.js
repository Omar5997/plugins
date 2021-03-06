/*
Build file to concat & minify files, compile SCSS and so on.
npm install gulp gulp-util gulp-uglify gulp-rename gulp-concat gulp-sourcemaps gulp-babel gulp-sass gulp-autoprefixer --save-dev
*/
// grab our gulp packages
var gulp  = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var notify = require("gulp-notify");
var fileinclude = require("gulp-file-include");

gulp.task("sass", function () {
	return gulp.src(["**/*.scss", "!node_modules/**"])
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(rename({ extname: ".css" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("."))
		.pipe(notify({
			message: "Sass done!",
			onLast: true
		}));
});

gulp.task("update", function() {
	gulp.src(["../mavo/.eslintrc.json"]).pipe(gulp.dest("."));
	return gulp.src(["../mavo.io/templates/*.html"]).pipe(gulp.dest("templates"));
});

gulp.task("html", function() {
	return gulp.src(["**/*.tpl.html"])
		.pipe(fileinclude({
			basepath: "templates/",
			context: {
				webRoot: "//mavo.io"
			}
		}).on("error", function(error) {
			console.error(error);
		}))
		.pipe(rename({ extname: "" }))
		.pipe(rename({ extname: ".html" }))
		.pipe(gulp.dest("."))
		.pipe(notify({
			message: "HTML done!",
			onLast: true
		}));
});

gulp.task("watch", function() {
	gulp.watch(["../mavo/.eslintrc.json"], gulp.series("update"));
	gulp.watch(["**/*.scss"], gulp.series("sass"));
	gulp.watch(["**/*.tpl.html", "../mavo.io/templates/*.html"], gulp.series("html"));
});

gulp.task("default", gulp.parallel("sass", "html"));
