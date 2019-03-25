const 	gulp 			= require("gulp"),
		pug 			= require("gulp-pug"),
		browserSync 	= require("browser-sync").create(),
		sass			= require("gulp-sass"),
		babel			= require("gulp-babel");

gulp.task("html", (done) => {
	gulp.src("./app/pug/index.pug")
	.pipe(pug({pretty: true}).on("error", (e)=>{console.log(e.toString());}))
	.pipe(gulp.dest("./dist/"));
	done();
});

gulp.task("css", (done) => {
	gulp.src("./app/scss/mainstyle.scss")
	.pipe(sass().on("error", (e)=>{console.log(e.toString());}))
	.pipe(gulp.dest("./dist/css/"));
	done();
});

gulp.task("js", (done) => {
	gulp.src("./app/js/mainscript.js")
	.pipe(babel().on("error", (e)=>{console.log(e.toString());}))
	.pipe(gulp.dest("./dist/js/"));
	done();
});

gulp.task("watch", (done)=>{
	browserSync.init({
		server: "./dist"
	});
	gulp.watch("./app/scss/*.scss", gulp.parallel("css"));
	gulp.watch("./app/pug/*.pug", gulp.parallel("html"));
	gulp.watch("./app/js/*.js", gulp.parallel("js"));
	gulp.watch("./dist/**/*.*").on("change", browserSync.reload);
	done();
});

gulp.task("default", gulp.parallel("watch"));