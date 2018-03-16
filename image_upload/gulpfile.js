'use strict';

var bs = require('browser-sync');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['nodemon', 'browser-sync']);

gulp.task('browser-sync', ['nodemon'], function() {
    bs.init(null, {
        port: "3001",
        proxy: "http://localhost:3000",
        files: ["views/**/*.*"],
        reloadOnRestart: true,
        browser: "chrome",
    });
});

function load_frontend() {
    console.log('-------- Starting browser-sync (frontend loader) --------');
    bs.reload();
}

gulp.task('nodemon', function (cb) {
    var started = false;
    var reloaded = false;
    return nodemon({
        // env: locals,
        watch: [
            "index.js",
            "server/*"
        ],

    })
    .on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }

        if (!load_frontend()) {
            load_frontend();
        }
    })
    .on('restart', function() {
        console.log('-------- Restarting Server --------');
    })
    .on('crash', function() {
        console.log('-------- APP CRASHED! Make sure you have valid Heroku credentials --------');
        console.log("-------- Type 'rs' [enter] on THIS command line to RESTART server --------");
        load_frontend();
    });
});