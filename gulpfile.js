/* Used plugins */
const 	gulp = require("gulp"),
		pug = require("gulp-pug"),
		browserSync = require("browser-sync").create(),
		sass = require("gulp-sass"),
		autoprefixer = require("gulp-autoprefixer"),
		babel = require("gulp-babel");

/* Error handler-function */
function errorHandler(error) {
	console.log(error.toString());
}

/* HTML handler-function:
** one-source-file >
** pug-to-HTML + log-errors >
** one-output-file >
** live-reload-after-compiling.
*/
function htmlHandler() {
	return gulp.src("./app/pug/index.pug")
	.pipe(pug({pretty: true}).on("error", errorHandler))
	.pipe(gulp.dest("./dist/"))
	.pipe(browserSync.stream());
}

/* CSS handler-function:
** one-source-file(scss) >
** SASS-to-CSS + log-errors >
** add-prefixes >
** one-output-file >
** inject-changes-into-browser.
*/
function cssHandler() {
	return gulp.src("./app/scss/mainstyle.scss")
	.pipe(sass().on("error", errorHandler))
	.pipe(autoprefixer({
		browsers: ["last 3 versions"],
		cascase: false
	}))
	.pipe(gulp.dest("./dist/css/"))
	.pipe(browserSync.stream());
}

/* JavaScript hadler-function:
** one-source-file >
** ES6-to-ES6 + log-errors >
** one-output-file >
** live-reload-after-compiling.
*/
function jsHandler() {
	return gulp.src("./app/js/mainscript.js")
	.pipe(babel().on("error", errorHandler))
	.pipe(gulp.dest("./dist/js/"))
	.pipe(browserSync.stream());
}

/* Start Server function */
function serverInit() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
}

/* Watch function:
** start-server +
** watch-files.
*/
function watch() {
	serverInit();
	gulp.watch("./app/scss/*.scss", cssHandler);
	gulp.watch("./app/pug/*.pug", htmlHandler);
	gulp.watch("./app/js/*.js", jsHandler);
}

/* Default task is: watch */
gulp.task("default", watch);