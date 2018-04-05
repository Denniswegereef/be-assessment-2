'use strict'

const gulp = require('gulp'),
    sass = require('gulp-sass'),

    connect = require('gulp-connect'),

    gutil = require('gulp-util'),
    chalk = require('chalk')


const dirs = {
    src: './src',
    dest: './static'
}
const paths = {
    css: {
        main: `${dirs.src}/scss/main.scss`,
        watch: `${dirs.src}/scss/**/*.scss`,
        dest: `${dirs.dest}`
    }
}

gulp.task('sass', () => {
    gulp.src(paths.css.main)
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(connect.reload())
})

gulp.task('watch', () => {
    gulp.watch(paths.css.watch, ['sass'])
    gutil.log(chalk.yellow('Watch is running'))
})

gulp.task('default', ['sass', 'watch'])
