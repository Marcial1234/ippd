'use strict';

var bs = require('browser-sync');
var gulp = require('gulp');
var exec = require('child_process').exec;
var clear = require('clear');
var nodemon = require('gulp-nodemon');
var config_loader = require('dotenv');

var locals = config_loader.load();

// gulp.task('default', ['nodemon']);
gulp.task('default', ['nodemon', 'browser-sync',]);
// gulp.task('default', ['get-config', 'nodemon', 'browser-sync',]);

gulp.task('get-config', function(cb) {
    if (exec("heroku config -s > .env"))
        cb();
});

gulp.task('browser-sync', ['nodemon'], function() {
    bs.init(null, {
        proxy: "http://localhost:5000",
        files: ["client/**/*.*"],
        browser: "chrome",
        port: "5001",
        // reloadOnRestart: true,
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
        env: locals,
        watch: [
            "server.js",
            "server/",
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
        // clear();
        console.log('-------- Restarting Server --------');
    })
    .on('crash', function() {
        // clear();
        console.log('-------- APP CRASHED! Make sure you have valid Heroku credentials --------');
        console.log("-------- Type 'rs' [enter] on THIS command line to RESTART server --------");
        load_frontend();
    });
});