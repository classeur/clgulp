var spawn = require('child_process').spawn;
var gulp = require('gulp');
var bump = require('gulp-bump');
var util = require('gulp-util');

gulp.task('patch', bumpTask('patch'));
gulp.task('minor', bumpTask('minor'));
gulp.task('major', bumpTask('major'));

function bumpTask(importance) {
    return function() {
        return gulp.src([
                './package.json'
            ])
            .pipe(bump({
                type: importance
            }))
            .pipe(gulp.dest('./'));
    };
}

function exec(cmds, cb) {
    if (cmds.length === 0) {
        return cb();
    }
    var cmd = cmds.shift().split(/\s+/);
    var proc = spawn(cmd.shift(), cmd, {
        cwd: process.cwd()
    });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('error', function(error) {
        util.log(util.colors.red(error));
        cb(error);
    });
    proc.on('exit', function(code) {
        if (code) {
            return cb(code);
        }
        exec(cmds, cb);
    });
}

exports.exec = exec;
exports.gulp = gulp;
exports.util = util;