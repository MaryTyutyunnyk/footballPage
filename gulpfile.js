'use strict';

// General modules
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSequence = require('gulp-sequence');
const clean = require('gulp-clean');
const plumber = require('gulp-plumber'); // To track bugs

//Styles
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');

// JS
const sourcemaps = require('gulp-sourcemaps');

// Images
const imagemin = require('gulp-imagemin');

gulp.task('clean', () =>
 	gulp.src('./dist', {
      read: false
    })
        .pipe(clean())
);

gulp.task('html', () => {
	gulp.src('./src/index.html')
		.pipe(gulp.dest('./dist'))
});

gulp.task('scss', () =>
	gulp.src('./src/scss/main.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			errLogToConsole: true,
			outputStyle: 'expanded' // Добавление отступов между классами в итоговых стилях
		}))
		.pipe(autoprefixer({
			browsers: ['last 15 versions'],
			cascade: false
		}))
		.pipe(gcmq())
		.pipe(sourcemaps.write())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
);

gulp.task('img', () => {
	gulp.src('./src/img/*')
		// .pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', () => {
	gulp.src('./src/fonts/**/*.*')
		.pipe(gulp.dest('./dist/fonts'))
});


gulp.task('build', gulpSequence('clean', ['html'], ['scss'], ['fonts'], ['img']));

gulp.task('dev', ['build'], () => {
	browserSync.init({
		server: "dist"
	});
	gulp.watch('./src/scss/**/*.scss', ['scss']).on('change', browserSync.reload);
	gulp.watch('./src/img/**/*', ['img']).on('change', browserSync.reload);
	gulp.watch('./src/index.html').on('change', browserSync.reload);
});

